# node-red-contrib-rasa-actionserver

Rasa Action Server on Node-RED is a set of nodes that simplify the creation of custom actions for Rasa-powered chatbots. With Node-RED's intuitive low-code environment, building, testing, and maintaining custom actions for conversational assistants becomes faster and more accessible.

Built for Rasa v3.05+ and fully compatible with Node-RED v2.1.5+, this project supports the Rasa Action Server HTTP API, providing dedicated nodes for processing Rasa action requests, managing slots, and generating Rasa-compatible responses.

## Key Features

- **Low-code Integration**: Build action servers visually without extensive coding.
- **Simplified Testing**: Use the `simrasa` node to simulate Rasa requests.
- **Custom Action Flexibility**: Leverage Node-RED’s ecosystem to integrate APIs, databases, and other services.
- **Response Generation**: Built-in nodes for text, button, and attachment responses.
- **Slot Management**: Easily set, update, or clear Rasa slots

## Background and Details

### What is Rasa?


Rasa is a platform for building chatbots. Rasa chatbots can function as conversational assistants, allowing users to issue commands or requests in natural language, which the assistant fulfills seamlessly in the background.

When the conversational assistant encounters tasks that cannot be handled by its built-in functionality, it relies on custom coded actions. Rasa provides a Python SDK for implementing custom actions, but the necessary cooing effort can be a challenge for non-coders.

Alternatively, Rasa can delegate action fulfillment to a standalone action server, communicating with it via REST calls. 

Fulfilling user requests often requires integration with additional systems. Thus, custom actions often need to connect to external services or APIs.
Here, a visual low-code platform like Node-RED offers simple alternative to classical coding.

### What is Node-RED?

Node-RED is a low-code platform running on Node.js. It offers a browser-based GUI where you can create flows by drag-and-dropping nodes from a palette onto a canvas. Flows in Node-RED consist of interconnected nodes that process JSON messages, perform actions, and exchange data with APIs, services, or devices.

Node-RED comes with built-in nodes for handling HTTP requests and responses, manipulating, JSON, conditional branching, and much more.
Additionally, there is a wealth of contributed nodes from various sources, that are easily installed when more functionality is needed.
This makes Node-RED well-suited for building Rasa action servers.


###  What is Rasa Action Server on Node-RED?

Rasa Action Server on Node-RED is a set of nodes that help using  Node-RED flows as an Action Server for a Rasa chatbot. Specifically, these nodes implement the Rasa action server HTTP API as specified in <a href="https://rasa.com/docs/action-server/http-api-spec">Rasa Action Server HTTP API</a>.


## How to Use

### Typical Flow Structure

A Rasa Action Server flow in Node-RED generally follows this structure:

1. **Start**: An `HTTP in` node to receive incoming requests from Rasa.
2. **Initialization**: An `Init` node to process the request and set up the flow context.
3. **Action Handling**: Nodes that handle tasks such as API calls, database queries, or custom logic.
4. **Response Generation**: Specialized nodes for creating responses in various formats (explained below).
5. **Response Assembly**: A `finish` node to compile the response in a Rasa-compatible format.
6. **End**: An `HTTP response` node to send the result back to Rasa.

### Nodes for Generating Responses

The Rasa Action Server on Node-RED includes three nodes for transforming responses:

- `sendtext`: Generates a simple text response.
- `sendbuttons`: Creates a response with buttons for user interaction.
- `sendextra`: Adds images or attachments to the response.

Each node provides two options for defining the response content:

- Specify a fixed content directly in the node configuration.
- Configure the node to retrieve the content dynamically from `msg.payload`.

### Further  nodes

#### Node for Managing Slots

Slots are a Rasa chatbot's memory mechanism, identified by a name and used to store dialogue-related information. Slot values are sent to the action server during a custom action request and often serve as parameters for the server's actions. For example, a weather bot may use a slot value for a location to provide relevant weather information.

Rasa Action Server on Node-RED facilitates reading and evaluating slot values. Additionally, the `setslots` node enables the clearing or updating of Rasa slots within a custom action.

#### Node for Testing Actions

The `simrasa` node is designed to simulate Rasa-like messages, allowing for action testing without requiring a live Rasa instance. The name `simrasa` stands for "Simulate Rasa."


### Installation
- Prerequisite: you have installed Node-RED 
- Add Node-RED-contrib-rasa-actionserver to Node-RED palette
- Design your flow. Start it with an ``HTTP in`` node listening at ``/webhook``
- Configure the action server endpoint in Rasa ``endpoints.yml``, e.g.,

```yaml
action_endpoint:
    url: http://127.0.0.1:1880/webhook
```

### Unit tests

Since version v1.2, Rasa Action Server on Node-RED includes unit tests. Furthermore, it includes a test setup comprising a small Rasa chatbot and a Node-RED flow.

## References

  - [Rasa Action Server HTTP
    API](https://rasa.com/docs/action-server/http-api-spec)
  - Weber, Irene: [Low-code from frontend to backend: Connecting conversational user interfaces to backend services via a low-code IoT platform](https://arxiv.org/pdf/2410.00006). In: CUI 2021 - 3rd Conference on Conversational User Interfaces. Bilbao (online) Spain : ACM, 2021 — DOI 10.1145/3469595.3469632 .

## How to cite 
In academic contexts, please cite the paper mentioned above as

<sup>
@inproceedings{weberCuiLowcode2021,  
  author = {Weber, Irene},  
	title = {Low-code from frontend to backend: {Connecting} conversational user interfaces to backend services via a low-code {IoT} platform},   
  booktitle = {{CUI} 2021 - 3rd {Conference} on {Conversational} {User} {Interfaces}},
  address = {Bilbao (online) Spain},  
	doi = {10.1145/3469595.3469632},
	isbn = {978-1-4503-8998-3}, url = {https://dl.acm.org/doi/10.1145/3469595.3469632}, publisher = {ACM},
	month = jul,
	year = {2021},
	pages = {1--5}
}
</sup>


[![DOI](https://zenodo.org/badge/334833949.svg)](https://zenodo.org/badge/latestdoi/334833949)
