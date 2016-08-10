# Policy-Visualizer #

## Owners ##

Matt Deyo ([mdeyo@mit.edu](mdeyo@mit.edu))

Tiago Vaquero ([tvaquero@mit.edu](tvaquero@mit.edu))

## Description ##

This project was made with the goal of making a browser-based JavaScript visualizer for policies produced by RAO* examples. We are hoping to address the needs to debug and share resulting policies with this tool. 

The lisp RAO* implementation now has a *save-solution-graph-to-json* function in order to convert the results into a format that can be directly uploaded to the visualizer.

The Viz.js graphing features were developed by Almende B.V. and the project is available at [https://github.com/almende/vis](https://github.com/almende/vis).

## Installation

There are no additional dependencies to get this project working, just clone the repo and navigate to index.html with your browser.

## Defining Nodes ##

```json
"nodes": {
    "node-0": {
        "state": "[(= R1-LOCATION L1)(= R1-MASTCAM OFF)] (Execution step: 0)",
        "risk": 0.0,
        "value": 30,
        "is-terminal": "false"
    },
    "node-1": {
        "state": "[(= R1-LOCATION L1)(= R1-MASTCAM ON)] (Execution step: 1)",
        "risk": 0.05,
        "value": 35,
        "is-terminal": "true"
    },
    "node-2": {
        "state": "[(= R1-LOCATION L1)(= R1-MASTCAM BROKEN)] (Execution step: 1)",
        "risk": 0.1,
        "value": 40,
        "is-terminal": "false"
    },
    "node-3": {
        "state": "[(= R1-LOCATION L1)(= R1-MASTCAM ON)] (Execution step: 2)",
        "risk": 0.1,
        "value": 45,
        "is-terminal": "true"
    }
}
```

## Defining Edges ##

```json
"edges": {
    "edge-0": {
        "action": "(= R1-MASTCAM.CMD TURN_ON)",
        "predecessor": "node-0",
        "successors": ["node-1", "node-2"]
    },
    "edge-1": {
        "action": "(= R1-MASTCAM.CMD FIX)",
        "predecessor": "node-2",
        "successors": ["node-3"]
    }
}
```

## Defining Settings ##

```json
"settings": {
    "nodes": {
        "display-properties": ["value"],
        "color": "#99ccff",
        "terminal-color": "#7BE141"
    },
    "edges": {
        "display-properties": ["action", "probability"],
        "color": "#99ccff"
    }
}
```

## Code Example ##

An example data file is included as examples/example_simple.json to be uploaded into the visualizer.

The json formatting is shown below with three objects within the json file:
  * nodes
  * edges
  * settings (optional)


```json
{
    "nodes": {
        "node-0": {
            "state": "[(= R1-LOCATION L1)(= R1-MASTCAM OFF)] (Execution step: 0)",
            "risk": 0.0,
            "value": 30,
            "is-terminal": "false"
        },
        "node-1": {
            "state": "[(= R1-LOCATION L1)(= R1-MASTCAM ON)] (Execution step: 1)",
            "risk": 0.05,
            "value": 35,
            "is-terminal": "true"
        },
        "node-2": {
            "state": "[(= R1-LOCATION L1)(= R1-MASTCAM BROKEN)] (Execution step: 1)",
            "risk": 0.1,
            "value": 40,
            "is-terminal": "false"
        },
        "node-3": {
            "state": "[(= R1-LOCATION L1)(= R1-MASTCAM ON)] (Execution step: 2)",
            "risk": 0.1,
            "value": 45,
            "is-terminal": "true"
        }
    },
    "edges": {
        "edge-0": {
            "action": "(= R1-MASTCAM.CMD TURN_ON)",
            "predecessor": "node-0",
            "successors": ["node-1", "node-2"]
        },
        "edge-1": {
            "action": "(= R1-MASTCAM.CMD FIX)",
            "predecessor": "node-2",
            "successors": ["node-3"]
        }
    },
    "settings": {
        "nodes": {
            "display-properties": ["value"],
            "color": "#99ccff",
            "terminal-color": "#7BE141"
        },
        "edges": {
            "display-properties": ["action", "probability"],
            "color": "#99ccff"
        }
    }
}
```

More detailed examples to come...

## Browser Compatibility

At this point, we know that all of the included visualization features function with:
  * Firefox 47.0
  * Chrome 52.0.2743.82

## Contributors

We are looking to generalize this project for any policy visualization needs of the group. That means we want to get feedback on problems that you encounter and new ideas that you have to improve this tool, including:

  * JSON formatting issues
  * Browser compatibility issues
  * New features to transform the policy graph
  * Adding functionality for policies other than those currently supported
  * ...

You can email me at [mdeyo@mit.edu](mdeyo@mit.edu) or can post issues directly on the project.
