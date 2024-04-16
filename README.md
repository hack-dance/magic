# M.A.G.I.C

Make it more agentic

---
[ Original MAGIC blog post ](https://hack.dance/thoughts/magic)



[![Twitter Follow](https://img.shields.io/twitter/follow/dimitrikennedy?style=social)](https://twitter.com/dimitrikennedy)
[![](https://img.shields.io/badge/MADE%20BY%20NOVY-000000.svg?style=flat-square&labelColor=000000&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMTQuNjkgMjU5LjI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgIHN0cm9rZS13aWR0aDogMHB4OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMC42MSwxNzguNDVoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMC0xMDguOTZ2MjMuNzJoMTMuOTd2LTIzLjcyaC0xMy45N1ptLTIuNzksMTg5Ljc1aDE5LjU2bC0yLjc5LTI4LjkyaC0xMy45N2wtMi43OSwyOC45MlptMi43OS0xMzcuNjJoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMCwyOC40MWgxMy45N3YtMTkuNjJoLTEzLjk3djE5LjYyWiIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iOTQuNSIgY3k9IjY5LjExIiByPSIxNC4yNCIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMTIwLjE5IiBjeT0iNjkuMTEiIHI9IjE0LjI0Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMjE0LjI1LDYyLjU5Yy0uNzktLjc1LTE4Ljc1LTE3LjQ4LTQ5LjQ2LTE5LjA0bDE1Ljc1LTUuODhjLTEuNjctMi40Ni00LjAxLTQuMTgtNi4zNS02LS4yMy0uMTgtLjAzLS41OC4yMy0uNTcsMy40NS4xNyw2LjgyLDEuNzUsMTAuMTIsMi42OCwxLjA2LjMsMi4wOS43MiwzLjA4LDEuMjRsMTkuNDUtNy4yNmMuNTMtLjIuOS0uNzEuOTEtMS4yOHMtLjMyLTEuMDktLjg1LTEuMzJjLTEuMDQtLjQ0LTI1Ljk2LTEwLjc2LTU3LjM1Ljk2LTEuMTkuNDQtMi4zNy45MS0zLjU0LDEuNDFsMTMuNTEtMTMuMTNjLTIuMTgtLjY3LTQuNC0uOTUtNi42My0xLjQ0LS4zOC0uMDgtLjQxLS43NSwwLS44MSwzLjEyLS40NCw2LjU0LS45OCw5Ljg3LS45MWw5LjEzLTguODdjLjQxLS40LjUzLTEuMDEuMzItMS41My0uMjItLjUzLS44LS43OS0xLjMxLS44Ny0uOTYuMDEtMjMuNy40OS00My45NiwyMC4xOCwwLDAsMCwwLDAsMGwtMjAuMDcsMTkuNzYtMTkuNTgtMTkuNzZDNjcuMjUuNDksNDQuNTEuMDEsNDMuNTUsMGMtLjU2LjA1LTEuMDkuMzQtMS4zMS44Ny0uMjIuNTMtLjA5LDEuMTQuMzIsMS41M2w1LjY3LDUuNTFjNS4xLjIyLDEwLjE0LjcxLDE0LjQzLDQsLjQyLjMyLjIsMS4xMi0uMzkuOTMtMi41OC0uODYtNi4wMi0uODctOS4zOS0uNGwxNS41NiwxNS4xMmMtMS4xNy0uNS0yLjM2LS45Ny0zLjU0LTEuNDEtMzEuNC0xMS43Mi01Ni4zLTEuNDEtNTcuMzUtLjk2LS41Mi4yMi0uODYuNzUtLjg1LDEuMzJzLjM3LDEuMDguOTEsMS4yOGwxMS4wNiw0LjEzYzQuNDYtMS40OCw4LjctMi4zOSwxMC40Mi0yLjU1LjU3LS4wNS41Ni43My4xMi45MS0xLjg2Ljc0LTMuNjEsMi4yOS01LjI3LDMuNjFsMjUuOTQsOS42OEMxOS4xOCw0NS4xMSwxLjIyLDYxLjg0LjQzLDYyLjU5Yy0uNDEuMzktLjU1LDEtLjM0LDEuNTMuMjEuNTMuNzMuODgsMS4zLjg4aDEzLjljLjE1LS4wOS4zMS0uMTkuNDUtLjI4LDUuNzktMy41OCwxMS45NC02LjE5LDE4LjE4LTguODcuNjgtLjI5LDEuMjguNjQuNiwxLjAzLTMuNTQsMi4wMy02LjU0LDUuMS05LjQ5LDguMTNoMTQuNTljNC4yNy0zLjExLDguODItNS43LDEzLjE2LTguNy41OS0uNDEsMS4yMi40OS43NS45Ny0yLjM1LDIuMzgtNC40NCw1LjA2LTYuNTMsNy43NGgxMTYuODNjLS45OS0zLjE5LTIuMDItNi4zNS00LjEzLTkuMDQtLjMzLS40Mi4xOC0uOTYuNTktLjU5LDMuMzYsMy4wMSw3LjM3LDYuMTUsMTEuMDIsOS42M2gxNS4zNGMtMS4zOC0zLjUyLTMuMDUtNi44Mi01LjcxLTguNjctLjU0LS4zNy0uMDgtMS4xNS41MS0uODcsNC40LDIuMDgsOC4yNyw1Ljg2LDExLjY1LDkuNTRoMjAuMmMuNTcsMCwxLjA5LS4zNSwxLjMtLjg4LjIxLS41My4wOC0xLjE0LS4zNC0xLjUzWiIvPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMS4wNiwyMjEuMzNoMTMuOTd2LTMzLjZoLTEzLjk3djMzLjZaIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=)](https://novy.ai)

MAGIC (Machine-Assisted Generative Intelligence and Coordination) is a framework for creating autonomous systems powered by Large Language Models (LLMs). It provides a structured environment where agents, powered by LLMs, perform tasks through defined actions, which can be executed directly or delegated to specialized agents, enhancing the system's flexibility and capability.

The MAGIC framework aims to simplify the process of building and managing complex, LLM-powered automation systems by providing a clear, well-defined structure for agent creation, task delegation, and action execution -- and a long overly-verbose name to avoid any miscommunication.

> This repo serves as an example for how to implement these concepts in a very basic way, there isnt anything to install or use other then the CLI. If there is anything useful to you please feel free to copy/paste or use as a reference, whatever. If there is enough interest, I may wrap a few things up into something a bit more structured.

## Running the examples
The local examples are stubbed out with fake db and there is a CLI for running a stateful session locally. I like to use bun, but you could use node + npm/pnpm/whatever but will have to run the cli with the direct command using tsnode or something similar.

**Install the deps**
```bash
  bun install
```

**Run cli directly**
```bash
  bun run cli
```

**Use the magic command**
```bash
  bun link
```
```bash
  bun link magic
```
```bash
  magic
```

## Core Components
- **Agent Identity and Parameters**: Each agent within the MAGIC system has a defined identity and set of parameters guiding its operations, interactions, and decision-making processes.
- **Agent Schema**: This defines the expected structured output from an agent, ensuring consistency and reliability in the agent's responses and actions.
- **Action Definitions**: Actions represent tasks or operations an agent can perform. Each action has defined input parameters, a handler function, and context describing its purpose and usage conditions.

## Workflow
1. **Context and resource gathering and resolution**: The system will gather all relevant context and external resources it needs, given the input parameters - then resolve what of that set will be used to provide to the orchestration agent based on the configuration of the system (max token count, etc..)

2. **Task Reception and Analysis**: The orchestration agent analyzes incoming context and input parameters to understand their requirements and context.

3. **Delegate Selection and Task Execution**: Selects appropriate delegate agents or action handlers for task execution, who then process and perform the tasks, leveraging their specialized capabilities.

4. **Aggregation and Response**: Post-execution, the orchestration agent synthesizes the results, preparing responses or actions in alignment with overarching objectives.

5. **Feedback Loop**: Continuously reviews outcomes to refine task distribution and execution, enhancing the system’s efficiency and adaptability.

This structured workflow, built around the core components of MAGIC, enables the creation of flexible, adaptable, and efficient LLM-powered automation systems that can handle a wide range of tasks and scenarios.

##  Action Execution and Delegation
Actions in MAGIC are defined by their ability to cause change or fetch information as needed. Actions can be classified based on whether they have side effects or contribute to ongoing context awareness and decision-making processes.

- **Direct Action Execution**: Agents execute actions based on the LLM’s insights and predefined parameters, directly affecting the system or environment.

- **Delegated Action Execution**: Complex tasks are delegated to specialized agents, known as delegates, which are designed to handle specific operations efficiently. These delegates can be other LLM-powered agents or specialized automation systems, allowing for polymorphic task execution.

- **Side Effect and Context-Aware Actions**: Actions are categorized based on their nature—producing direct side effects or aiding in ongoing decision-making. This distinction aids in the management of action flows and their impact on the system.


## Using orchestrated delegation
In orchestrated delegation, a primary agent acts as a coordinator, directing tasks to delegate agents based on their specialized capabilities and the task's requirements. 

- **Orchestration Agent**: Manages the distribution of tasks, ensuring they are executed efficiently and effectively by the most suitable delegate.

- **Delegate Agents**: Perform the actions they are assigned, utilizing their specialized skills and knowledge to achieve the best outcome.



## But is it Agentic?
In the ever-evolving quest to anthropomorphize our algorithms, we've recently landed on ‘agentic’ to describe all things AI + automation (except for sometimes) - but.. What is an agent? What does it mean to be agentic? Is it just a bit of MAGIC? 

 Every person I speak to has a different definition, and it’s hard to take anyone seriously when they attempt to describe something simple with something vague.

 In this example and anywhere else in this code, agents are defined as a preconfigured instance of an LLM call, with an “identity” prompt and some optional set of static or dynamic messages pre- or post- pended to every request. 

Implementing a system that uses the ideas described in MAGIC is relatively simple - depending on the use case, it can scale up to handle an enormous amount of complexity - but the concepts remain the same at every new layer of added functionality. 

You will notice in the examples that I do not rely on llm function calling for the execution of actions - the reason is twofold:

1.  I usually want to keep the option to swap out a provider or model that may not support the same function calling ability

2. Anecdotal, but I have used this approach as well as function calling and multi function calling to try and achieve the same results and have observed that in most cases I am better able to prompt my way into having the agent adhere to my rules around when/what for calling functions when I define them in this way. (Behind the scenes -  to get the structured response we are using function calling when available - the action and actionParams are just params for our singular function that is requesting the structured response)

It works for me, but do what makes you happy.


#### Example Use Case: Automated Task Management
In a scenario like automated task management, the MAGIC system could use a core agent to assess the tasks at hand and delegate specific actions to other agents designed to handle those tasks. For example, the core agent might delegate a task like "schedule a meeting with John" to a calendar management agent, which would then handle the specifics of finding an available time slot and sending out the meeting invitation.

#### Example Use Case: Conversational Agents
In a conversational agent scenario, MAGIC would manage dialogue flow, content generation, and context retention, dynamically adjusting responses and actions based on the conversation's evolution and external data inputs. For instance, if a user asks about a specific product, the core agent could delegate the task of retrieving product information to a specialized product catalog agent, which would then return the relevant details to be incorporated into the core agent's response.


## Agentically Automating the Future

With a clear, well-defined and structured approach to agent creation, task delegation, and action execution, MAGIC demonstrates that the power of simple, thoughtful design and implementation of systems that leverage the capabilities of LLMs to solve real-world problems.

So, as we continue to build agentic systems and ponder the meaning of agency in the context of AI,  let’s remember that success of our "agentic" systems will be measured not by the cleverness of their names , but by their ability to make a difference in the lives of the people they serve. So let’s build with that in mind, and let the results speak for themselves.——
If you're interested in experimenting with the MAGIC framework or have ideas for how it could be improved, I encourage you to check out the code and share your thoughts. 


----

At [Novy](https://novy.ai), we are building LLM-powered solutions for clients across a wide range of industries. Our team is constantly learning, experimenting with new techniques, and exploring innovative ideas. MAGIC is based on a high-level architecture we have employed successfully in many projects.

In the future, we may open-source more of the components we use to build our systems, allowing the community to benefit from our experience and contribute to the development of advanced LLM-powered automation solutions.

If you're interested in discussing how these systems can evolve, tools you wish existed,  or exploring what's possible with LLM-powered automation, please reach out  [@dimitrikennedy](https://twitter.com/dimitrikennedy), I’m always excited to connect share ideas.

----