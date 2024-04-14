import { z } from "zod"

const baseModelSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.number(),
  updatedAt: z.number()
})

export const userSchema = baseModelSchema.extend({
  name: z.string().optional(),
  email: z.string().email().optional()
})

export type User = z.infer<typeof userSchema>

const messageSchema = baseModelSchema.extend({
  content: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  userRef: z.string().uuid(),
  conversationRef: z.string().uuid()
})
export type Message = z.infer<typeof messageSchema>

const conversationSchema = baseModelSchema.extend({
  messageRefs: z.array(z.string().uuid())
})

export type Conversation = z.infer<typeof conversationSchema>

const schemas = {
  user: userSchema,
  message: messageSchema,
  conversation: conversationSchema
} as const

export type SchemaOf<K extends keyof typeof schemas> = (typeof schemas)[K]

type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

type IncludeSchema<T extends z.AnyZodObject> = {
  [K in keyof z.infer<T>]?: K extends `${infer Model}Ref` | `${infer Model}Refs` ? Model : never
}

type ModelInstancesFromSchemas<Schemas extends Record<string, z.AnyZodObject>> = {
  [K in keyof Schemas]: Model<Schemas[K]>
}

type DB = ModelInstancesFromSchemas<typeof schemas>

class Model<T extends z.AnyZodObject> {
  private data: Map<string, z.infer<T>>
  private schema: T
  private name: string
  private models: Record<string, Model<z.AnyZodObject>> = {}

  constructor({ schema, name }: { schema: T; name: string }) {
    this.data = new Map()
    this.schema = schema
    this.name = name
  }

  _inferModels(db: DB) {
    const shape = this.schema.shape

    for (const key in shape) {
      if (key.endsWith("Ref")) {
        const modelName = key.slice(0, -3)
        const model = db[modelName as keyof DB]

        if (model instanceof Model) {
          this.models[modelName] = model
        }
      } else if (key.endsWith("Refs")) {
        const modelName = key.slice(0, -4)
        const model = db[modelName as keyof DB]
        if (model instanceof Model) {
          this.models[modelName] = model
        }
      }
    }
  }

  public upsert({ id, data }: { id?: string; data: Partial<z.infer<T>> }) {
    if (id && this.data.has(id)) {
      return this.update({ id, data })
    }

    return this.create({ data: { ...data, id } })
  }

  public create({ data }: { data: Omit<z.infer<T>, "id" | "createdAt" | "updatedAt"> }) {
    const id = crypto.randomUUID()
    const now = new Date().valueOf()

    const validatedData = this.schema.parse({
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    })

    if (!validatedData) {
      throw new Error(`Failed to create record for ${this.name}`)
    }

    for (const key in data) {
      if (key.endsWith("Ref") || key.endsWith("Refs")) {
        const modelName = key.slice(0, -3)
        const model = this.models[modelName]
        if (model) {
          const refId = data[key as keyof typeof data as string]
          if (Array.isArray(refId)) {
            for (const id of refId as string[]) {
              if (!model.exists(id)) {
                throw new Error(`Invalid reference: ${modelName} with id ${id} does not exist`)
              }
            }
          } else if (!model.exists(refId)) {
            throw new Error(`Invalid reference: ${modelName} with id ${refId} does not exist`)
          }
        }
      }
    }

    this.data.set(id, {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    })

    return this.data.get(id) as z.infer<T>
  }

  public getMany<I extends IncludeSchema<T>>({
    where,
    include
  }: {
    where?: Partial<z.infer<T>>
    include?: (keyof I)[]
  }) {
    const data = Array.from(this.data.values()).filter(item => {
      if (!where) {
        return true
      }
      for (const [key, value] of Object.entries(where)) {
        if (item[key as keyof typeof item] !== value) {
          return false
        }
      }
      return true
    })

    if (include) {
      return data.map(item => {
        const includedData: Record<string, unknown> = { ...item }
        for (const key of include) {
          const refKey = `${String(key)}Ref`
          const refsKey = `${String(key)}Refs`
          if (refKey in item) {
            const model = this.models[key as string]
            if (model) {
              const refId = item[refKey as keyof typeof item] as string
              includedData[key as string] = model.getUnique({ where: { id: refId } })
            }
          } else if (refsKey in item) {
            const model = this.models[key as string]
            if (model) {
              const refIds = item[refsKey as keyof typeof item] as string[]
              includedData[key as string] = refIds.map(id => model.getUnique({ where: { id } }))
            }
          }
        }
        return includedData as z.infer<T> & {
          [K in keyof I]: z.infer<(typeof schemas)[keyof typeof schemas & I[K]]>
        }
      })
    }

    return data as z.infer<T>[]
  }

  public getUnique<I extends IncludeSchema<T>>({
    where,
    include
  }: {
    where: Partial<z.infer<T>>
    include?: (keyof I)[]
  }) {
    const data = Array.from(this.data.values()).find(item => {
      for (const [key, value] of Object.entries(where)) {
        if (item[key as keyof typeof item] !== value) {
          return false
        }
      }
      return true
    })

    if (!data) {
      throw new Error(`No record found matching the provided criteria`)
    }

    if (include) {
      const includedData: Record<string, unknown> = { ...data }
      for (const key of include) {
        const refKey = `${String(key)}Ref`
        const refsKey = `${String(key)}Refs`
        if (refKey in data) {
          const model = this.models[key as string]
          if (model) {
            const refId = data[refKey as keyof typeof data] as string
            includedData[key as string] = model.getUnique({ where: { id: refId } })
          }
        } else if (refsKey in data) {
          const model = this.models[key as string]
          if (model) {
            const refIds = data[refsKey as keyof typeof data] as string[]
            includedData[key as string] = refIds.map(id => model.getUnique({ where: { id } }))
          }
        }
      }

      return includedData as z.infer<T> & {
        [K in keyof I]: z.infer<(typeof schemas)[keyof typeof schemas & I[K]]>
      }
    }

    return data as z.infer<T>
  }

  exists(id: string) {
    return this.data.has(id)
  }

  update({ id, data }: { id: string; data: Partial<z.infer<T>> }) {
    const existingData = this.getUnique({ where: { id } })
    const updatedData = this.schema.parse({
      ...existingData,
      ...data,
      updatedAt: new Date().valueOf()
    })

    this.data.set(id, updatedData)

    return this.data.get(id)
  }

  delete({ id }: { id: string }) {
    const data = this.getUnique({ where: { id } })
    this.data.delete(id)
    return data
  }
}

const dbInstance: DB = {
  user: new Model({ schema: userSchema, name: "user" }),
  message: new Model({ schema: messageSchema, name: "message" }),
  conversation: new Model({ schema: conversationSchema, name: "conversation" })
}

Object.values(dbInstance).forEach(model => {
  model._inferModels(dbInstance)
})

export const db: Mutable<DB> = dbInstance as Mutable<DB>
