// create an array with nodes
var nodes = new vis.DataSet([{
    id: 1,
    label: 'Node 1'
}, {
    id: 2,
    label: 'Node 2'
}, {
    id: 3,
    label: 'Node 3'
}, {
    id: 4,
    label: 'Node 4'
}, {
    id: 5,
    label: 'Node 5'
}]);

// create an array with edges
var edges = new vis.DataSet([{
    from: 1,
    to: 2
}, {
    from: 2,
    to: 3
}, {
    from: 3,
    to: 4
}, {
    from: 2,
    to: 5
}]);

var container = document.getElementById('mynetwork');

var cleanedUpText;
var network;
var btnUD;
var btnLR;
var network_options;
var levelSeparationValue = 400;
var nodeSpacingValue = 600;

function init() {

    var checkboxes = document.getElementsByTagName('input');

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox') {
            checkboxes[i].checked = false;
        }
    }

    $(function() {
        $("#output_container").resizable();
        // {containment: "#output_container"});
    });


    $('li.dropdown.mega-dropdown a').on('click', function(event) {
        $(this).parent().toggleClass("open");
    });

    $('body').on('click', function(e) {
        if (!$('li.dropdown.mega-dropdown').is(e.target) && $('li.dropdown.mega-dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
            $('li.dropdown.mega-dropdown').removeClass('open');
        }
    });

    hierarchicalDirection = "UD";

    network_options = {
        layout: {
            improvedLayout: true,
            hierarchical: {
                enabled: false
            }
        },
        interaction: {
            hover: true,
            hideEdgesOnDrag: true

        },
        edges: {
            smooth: {
                type: 'continuous'
            }
        },
        physics: false
    };

}

function updateHierarchical(cb) {
    console.log("Clicked, new value = " + cb.checked);
    if (cb.checked) {
        document.getElementById("interactions").style.display = "inline-flex";
        document.getElementById("slider1").value = "5";
        document.getElementById("slider2").value = "5";

        network_options.layout.hierarchical.enabled = true;
        network_options.physics = false;
        // network.setOptions(network_options);
        // resetNetwork()

    } else {
        document.getElementById("interactions").style.display = "none";

        network_options.physics = false;
        network_options.layout.hierarchical.enabled = false;

        // network.setOptions(network_options);
        // resetNetwork();


    }

    console.log(network_options);
}

function orientUD() {
    hierarchicalDirection = "UD";
    network_options.layout.hierarchical.direction = "UD";
    network.setOptions(network_options);
    fitAnimated();
}

function orientLR() {
    hierarchicalDirection = "LR";
    network_options.layout.hierarchical.direction = "LR";
    network.setOptions(network_options);
    fitAnimated();
}

function updateSlider1(slideAmount) {
    levelSeparationValue = slideAmount * 100 + 100;
    network_options.layout.hierarchical.levelSeparation = levelSeparationValue;
    network.setOptions(network_options);
    fitAnimated();
}

function updateSlider2(slideAmount) {
    nodeSpacingValue = slideAmount * 150 + 100;
    network_options.layout.hierarchical.nodeSpacing = nodeSpacingValue;
    network.setOptions(network_options);
    fitAnimated();
}


// function safeParseJSON(input){
//   try {
//       JSON.parse(input);
//       console.log("cleaned it up!");
//       cleanedUpText = input;
//       var json_obj = JSON.parse(JSON.parse(cleanedUpText).toString());
//       console.log(json_obj);
//       showPolicy(json_obj);
//   }
//   catch(err) {
//       console.log(err);
//       var errorAt = err.message.split('column ')[1].split(' ')[0];
//       console.log( parseInt(errorAt));
//       input = input.substr(0, errorAt-1) + input.substr(errorAt);
//       // console.log(input);
//       safeParseJSON(input);
//   }
// }

function output(inp) {
    document.body.appendChild(document.createElement('pre')).innerHTML = inp;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function openFile(event) {
  document.getElementById('coverup').style.display = "block";
  
    //reset the updateProperties dialogue
    list_of_selected_properties = [];
    document.getElementById('properties_form').innerHTML = "<h3 style='margin: 0px;''>Select properties to draw on nodes:</h3>";

    var input = event.target;

    var reader = new FileReader();
    reader.onload = function() {

        var text = reader.result;
        // console.log(text);
        showPolicy(JSON.parse(text));
        var node = document.getElementById('output');
        // node.innerText = text;
        // node.innerText =JSON.parse(text);

    };
    reader.readAsText(input.files[0]);
};

var nodes_json_obj;
var edges_json_obj;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function fitAnimated() {

    var options = {
        duration: 500,
        easingFunction: "easeInOutQuad"
    };
    network.fit({
        animation: options
    });
}

function resetNetwork() {
    network.setData({
        nodes: nodes,
        edges: edges
    });
}

function showPropertyOptions() {
    document.getElementById('properties_form').style.display = "block";
    document.getElementById('coverup').style.display = "block";
    document.getElementById('close_properties').style.display = "block";

}

function hidePropertyOptions() {
    document.getElementById('properties_form').style.display = "none";
    document.getElementById('coverup').style.display = "none";
    document.getElementById('close_properties').style.display = "none";

}

function addPropertyCheckbox(type, property) {

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = property;
    checkbox.value = "value";
    checkbox.id = type + "-&-" + property;

    if (property == "Node ID") {
        checkbox.checked = true;
    }

    var label = document.createElement('label')
    label.htmlFor = property;
    label.appendChild(document.createTextNode(property));

    document.getElementById('properties_form').appendChild(checkbox);
    document.getElementById('properties_form').appendChild(label);
    document.getElementById('properties_form').appendChild(document.createElement('br'));

}

function finishProperties() {
    var submit = document.createElement('button');
    submit.type = "button";
    submit.innerHTML = "Update";
    submit.onclick = updateProperties;
    submit.style = "margin-top:10px;"
    document.getElementById('properties_form').appendChild(submit);
}

function open_file_go(e) {
    // The user actually wants to open a new file.
    // Try to trigger the file opener
    document.getElementById('file-input').click();
}


function focusRoot(scale) {
    var options = {
        // position: {x:positionx,y:positiony}, // this is not relevant when focusing on nodes
        scale: scale,
        animation: {
            duration: 1000,
            easingFunction: "easeInOutQuad"
        }
    };
    // statusUpdateSpan.innerHTML = 'Focusing on node: ' + nodeId;
    // finishMessage = 'Node: ' + nodeId + ' in focus.';
    network.focus(rootID, options);
}

function initProperties(settings_obj) {

    if (settings_obj) {

        var nodes_settings = settings_obj['nodes'];

        if (nodes_settings) {
            var list_of_properties = nodes_settings['display-properties'];
            if (list_of_properties) {
                var property_name;
                var new_label = "";
                for (node in states_from_json) {
                    var new_label = "";
                    for (i in list_of_properties) {
                        property_name = list_of_properties[i];
                        if (property_name == "node_id") {
                            new_label = new_label + [states_from_json[node].id] + "\n";
                        } else {
                            if (nodes_json_obj[states_from_json[node].id][property_name]) {
                                new_label = new_label + property_name + ": " + nodes_json_obj[states_from_json[node].id][property_name].toString() + "\n";
                            }
                        }
                    }
                    new_label = new_label.replace(/^\s+|\s+$/g, '');
                    states_from_json[node].label = new_label;
                }
            }
        }


        var edges_settings = settings_obj['edges'];

        if (edges_settings) {
            var list_of_properties = edges_settings['display-properties'];
            if (list_of_properties) {
                var property_name;
                var new_label = "";
                var short_edge_name;
                for (edge in links_from_json) {
                    var new_label = "";
                    short_edge_name = links_from_json[edge].id.split("b%@%n")[0];
                    for (i in list_of_properties) {
                        property_name = list_of_properties[i];
                        if (property_name == "edge_id") {
                            new_label = new_label + [links_from_json[edge].id] + "\n";
                        } else {
                            console.log(edge);
                            console.log(links_from_json[edge]);
                            console.log(short_edge_name);
                            if (edges_json_obj[short_edge_name][property_name]) {
                                console.log(edge);
                                console.log(links_from_json[edge]);
                                new_label = new_label + property_name + ": " + edges_json_obj[short_edge_name][property_name].toString() + "\n";
                            }
                        }
                    }
                    new_label = new_label.replace(/^\s+|\s+$/g, '');
                    links_from_json[edge].label = new_label;
                }
            }
        }


        network.setData({
            nodes: new vis.DataSet(states_from_json),
            edges: new vis.DataSet(links_from_json)
        });

    } else {


        showPropertyOptions();
    }


}

function updateProperties() {
    list_of_selected_properties = [];
    // console.log("updateProperties");

    hidePropertyOptions();

    var properties = document.getElementById('properties_form');

    for (child in properties.children) {
        if (properties.children[child].type == "checkbox" && Number.isInteger(parseInt(child)) && properties.children[child].checked) {
            list_of_selected_properties.push({
                'type': properties.children[child].id.split("-&-")[0],
                'property': properties.children[child].id.split("-&-")[1]
            });
        }
    }

    var property_name;
    var new_label = "";
    var short_edge_name;

    for (node in states_from_json) {
      new_label = "";
        for (i in list_of_selected_properties) {
            property_name = list_of_selected_properties[i];
            if (property_name.type == "node") {
                if (property_name.property == "Node ID") {
                    new_label = new_label + [states_from_json[node].id] + "\n";
                } else {
                    if (nodes_json_obj[states_from_json[node].id][property_name.property]) {
                        new_label = new_label + property_name.property + ": " + nodes_json_obj[states_from_json[node].id][property_name.property].toString() + "\n";
                    }
                }
            }
        }
        new_label = new_label.replace(/^\s+|\s+$/g, '');
        states_from_json[node].label = new_label;
    }

    for (edge in links_from_json) {
      new_label = "";
        short_edge_name = links_from_json[edge].id.split("b%@%n")[0];
        for (i in list_of_selected_properties) {
            property_name = list_of_selected_properties[i];
            if (property_name.type == "edge") {
                if (property_name.property == "Edge ID") {
                    new_label = new_label + [short_edge_name] + "\n";
                } else {
                    if (edges_json_obj[short_edge_name][property_name.property]) {
                        new_label = new_label + property_name.property + ": " + edges_json_obj[short_edge_name][property_name.property].toString() + "\n";
                    }
                }
            }
        }
        new_label = new_label.replace(/^\s+|\s+$/g, '');
        links_from_json[edge].label = new_label;
    }

    network.setData({
        nodes: new vis.DataSet(states_from_json),
        edges: new vis.DataSet(links_from_json)
    });
}

var states_from_json;
var links_from_json;

var set_of_properties = {};
var list_of_selected_properties = [];
var rootID;

function showPolicy(policy) {
    // console.log(JSON.stringify(policy));

    var our_graph_states = policy['nodes'];
    var our_graph_edges = policy['edges'];
    var our_graph_settings = policy['settings'];

    nodes_json_obj = our_graph_states; //global var
    edges_json_obj = our_graph_edges; //global var

    // console.log(our_graph_states);
    var states = [];
    var links = [];

    var current_state_obj = null;
    var next_timestep = 0;
    var color = "#99ccff"

    var depthExists = false;

    for (name in our_graph_states) {
        if (our_graph_states[name]['depth']) {
            depthExists = true;
            break;
        }
    }

    if (!depthExists) {
        for (name in our_graph_states) {
            our_graph_states[name]['depth'] = 0;
            rootID = name;
            break;
        }
    }


    // console.log("depthExists:"+depthExists.toString());

    color = "#7BE141"; //green color!

    for (name in our_graph_states) {

        // console.log(name);
        current_state_obj = our_graph_states[name];

        // if(current_state_obj['is-terminal']=="true"){
        //   color = "#7BE141";
        // }else{
        //   color = "#99ccff";
        // }

        color = "#7BE141"; //green color!


        for (edge_name in our_graph_edges) {
            current_edge_obj = our_graph_edges[edge_name];
            //check for existence of the predecessor state in our known states
            if (our_graph_states[current_edge_obj['predecessor']]) {
                if (current_state_obj == our_graph_states[current_edge_obj['predecessor']]) {
                    color = "#99ccff";
                }
            }
        }

        states.push({
            id: name,
            label: name,
            // +"\nvalue: "+current_state_obj['value']
            // +"\nacceptable-risk-ub: "+current_state_obj['acceptable-risk-ub']
            // +"\nexecution-risk-lb: "+current_state_obj['execution-risk-lb']
            // +"\nrisk: "+current_state_obj['risk'],
            level: 0,
            title: current_state_obj['state'],
            // title: 'location:R1 timestep:1 velocity:AVERAGE',

            color: color
        });
    }

    states_from_json = states;


    // console.log(current_state_obj);
    addPropertyCheckbox("node", "Node ID");

    for (property in current_state_obj) {
        addPropertyCheckbox("node", property);
    }




    var current_edge_obj = null;
    var child_state = null;

    //Iterate all action/connections saved
    for (edge_name in our_graph_edges) {
        current_edge_obj = our_graph_edges[edge_name];
        // console.log(current_edge_obj);

        //check for existence of the predecessor state in our known states
        if (our_graph_states[current_edge_obj['predecessor']]) {
            current_state_obj = our_graph_states[current_edge_obj['predecessor']];
            current_state_obj['color'] = "#99ccff";

            //Iterate through the children/successors of this saved action/connection
            var branch_num = -1;
            for (child_state in current_edge_obj['successors']) {
                branch_num = branch_num + 1;

                if (Object.prototype.toString.call(current_edge_obj['successors']) === '[object Array]') {
                    child_state = current_edge_obj['successors'][child_state];
                }

                //check for existence of the child state in our known states
                if (our_graph_states[child_state]) {
                    //Updates 'depth' for each state by incrementing for children that
                    // don't already have a depth calculated
                    if (!our_graph_states[child_state]['depth']) {
                        // console.log('does not have depth!');
                        our_graph_states[child_state]['depth'] = current_state_obj['depth'] + 1;
                        // console.log(our_graph_states[child_state]);
                    }

                    //Add each viz.js edge/connection from predecessor to successor
                    links.push({
                        id: edge_name + "b%@%n" + branch_num.toString(),
                        from: current_edge_obj['predecessor'],
                        to: child_state,
                        label: edge_name,
                        font: {
                            align: 'horizontal'
                        },
                        title: current_edge_obj['action'],
                        arrows: {
                            to: {
                                scaleFactor: 2
                            }
                        }
                    });
                } else {
                    // console.log(child_state);
                    console.error("child state not in nodes");;
                }
            }
        } else {
            console.error("predecessor state not in nodes");;
        }
    }

    links_from_json = links;


    document.getElementById('properties_form').innerHTML = document.getElementById('properties_form').innerHTML + "<br><h3 style='margin: 0px;''>To draw on edges:</h3>";
    // console.log(current_state_obj);
    addPropertyCheckbox("edge", "Edge ID");

    for (property in current_edge_obj) {
        addPropertyCheckbox("edge", property);
    }

    finishProperties();


    //Update each viz.js state object with the level that we calculated while iterating edges
    for (name in states) {
        // console.log(name);
        current_state_obj = states[name];
        current_state_obj['level'] = our_graph_states[current_state_obj['id']]['depth'];
        console.log("set level: " + our_graph_states[current_state_obj['id']]['depth'].toString());
    }

    console.log(states);

    edges = new vis.DataSet(links);
    nodes = new vis.DataSet(states);

    // create a network
    container = document.getElementById('mynetwork');

    dataset = {
        nodes: nodes,
        edges: edges
    };

    for (edge in edges.getIds()) {
        // console.log(edges.getIds()[edge]);
        displayEdgeData(edges.getIds()[edge])
    }

    // get a JSON object
    allNodes = nodes.get({
        returnType: "Object"
    });

    network = new vis.Network(container, dataset, network_options);

    initProperties(our_graph_settings);


    network.on("showPopup", function(params) {
        //  document.getElementById('output').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
    });

    network.on("click", function(params) {
        //  params.event = "[original event]";
        //  console.log(params);
        if (nodes_json_obj[params.nodes[0]]) {
            //  console.log(nodes_json_obj[params.nodes[0]]);
            //  console.log(nodes_json_obj[params.nodes[0]]['state']);
            document.getElementById('output').innerHTML = syntaxHighlight(JSON.stringify(nodes_json_obj[params.nodes[0]], undefined, 4));
            //  output(syntaxHighlight(JSON.stringify(nodes_json_obj[params.nodes[0]], undefined, 4)));
        } else if (params.edges[0]) {
            if (edges_json_obj[params.edges[0].split("b%@%n")[0]]) {
                document.getElementById('output').innerHTML = syntaxHighlight(JSON.stringify(edges_json_obj[params.edges[0].split("b%@%n")[0]], undefined, 4));
                // displayEdgeData(params.edges[0]);
                network.selectNodes([edges.get(params.edges[0]).from]);

            }
        }

    });

    network.on("doubleClick", function(params) {
        console.log("doubleClick");
        console.log(params);
        //  ancestorsHighlight(params);
    });


    document.getElementById('coverup').style.display = "none";

}

function displayEdgeData(edge_id) {
    // console.log(edges.get(edge_id));
    var short_edge_name = edge_id.split("b%@%n")[0];
    var edge_properties = edges_json_obj[short_edge_name].successors[edges.get(edge_id).to];
    for (id in edge_properties) {
        var new_edge = edges.get(edge_id);

        new_edge.label = new_edge.label + "\nprob: " + edge_properties[id].toString();
        // console.log(edge_properties[id]);
        // console.log(edges.get(edge_id));

        // new_label = new_label.substring(0, new_label.length - 1);
        edges.update(new_edge);


    }

    // network.setData({nodes:nodes, edges:new vis.DataSet(edges)});

    // console.log(edges_json_obj[short_edge_name].successors[edges.get(edge_id).to]);
    // console.log(short_edge_name);



}

var highlightActive = false;
var allNodes;
var dataset;

function ancestorsHighlight(params) {
    // if something is selected:
    if (params.nodes.length > 0) {
        highlightActive = true;
        var i, j;
        var selectedNode = params.nodes[0];
        var degrees = 2;

        // mark all nodes as hard to read.
        for (var nodeId in allNodes) {
            allNodes[nodeId].color = 'rgba(200,200,200,0.5)';
            if (allNodes[nodeId].hiddenLabel === undefined) {
                allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
                allNodes[nodeId].label = undefined;
            }
        }
        var connectedNodes = network.getConnectedNodes(selectedNode);
        var allConnectedNodes = [];

        // get the second degree nodes
        for (i = 1; i < degrees; i++) {
            for (j = 0; j < connectedNodes.length; j++) {
                allConnectedNodes = allConnectedNodes.concat(network.getConnectedNodes(connectedNodes[j]));
            }
        }

        // all second degree nodes get a different color and their label back
        for (i = 0; i < allConnectedNodes.length; i++) {
            allNodes[allConnectedNodes[i]].color = 'rgba(150,150,150,0.75)';
            if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
                allNodes[allConnectedNodes[i]].label = allNodes[allConnectedNodes[i]].hiddenLabel;
                allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
            }
        }

        // all first degree nodes get their own color and their label back
        for (i = 0; i < connectedNodes.length; i++) {
            allNodes[connectedNodes[i]].color = undefined;
            if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
                allNodes[connectedNodes[i]].label = allNodes[connectedNodes[i]].hiddenLabel;
                allNodes[connectedNodes[i]].hiddenLabel = undefined;
            }
        }

        // the main node gets its own color and its label back.
        allNodes[selectedNode].color = undefined;
        if (allNodes[selectedNode].hiddenLabel !== undefined) {
            allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
            allNodes[selectedNode].hiddenLabel = undefined;
        }


    } else if (highlightActive === true) {
        // reset all nodes
        for (var nodeId in allNodes) {
            allNodes[nodeId].color = undefined;
            if (allNodes[nodeId].hiddenLabel !== undefined) {
                allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
                allNodes[nodeId].hiddenLabel = undefined;
            }
        }
        highlightActive = false
    }

    // transform the object into an array
    var updateArray = [];
    for (nodeId in allNodes) {
        if (allNodes.hasOwnProperty(nodeId)) {
            updateArray.push(allNodes[nodeId]);
        }
    }
    nodes.update(updateArray);
}

// function neighbourhoodHighlight(params) {
//   // if something is selected:
//   if (params.nodes.length > 0) {
//     highlightActive = true;
//     var i,j;
//     var selectedNode = params.nodes[0];
//     var degrees = 2;
//
//     // mark all nodes as hard to read.
//     for (var nodeId in allNodes) {
//       allNodes[nodeId].color = 'rgba(200,200,200,0.5)';
//       if (allNodes[nodeId].hiddenLabel === undefined) {
//         allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
//         allNodes[nodeId].label = undefined;
//       }
//     }
//     var connectedNodes = network.getConnectedNodes(selectedNode);
//     var allConnectedNodes = [];
//
//     // get the second degree nodes
//     for (i = 1; i < degrees; i++) {
//       for (j = 0; j < connectedNodes.length; j++) {
//         allConnectedNodes = allConnectedNodes.concat(network.getConnectedNodes(connectedNodes[j]));
//       }
//     }
//
//     // all second degree nodes get a different color and their label back
//     for (i = 0; i < allConnectedNodes.length; i++) {
//       allNodes[allConnectedNodes[i]].color = 'rgba(150,150,150,0.75)';
//       if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
//         allNodes[allConnectedNodes[i]].label = allNodes[allConnectedNodes[i]].hiddenLabel;
//         allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
//       }
//     }
//
//     // all first degree nodes get their own color and their label back
//     for (i = 0; i < connectedNodes.length; i++) {
//       allNodes[connectedNodes[i]].color = undefined;
//       if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
//         allNodes[connectedNodes[i]].label = allNodes[connectedNodes[i]].hiddenLabel;
//         allNodes[connectedNodes[i]].hiddenLabel = undefined;
//       }
//     }
//
//     // the main node gets its own color and its label back.
//     allNodes[selectedNode].color = undefined;
//     if (allNodes[selectedNode].hiddenLabel !== undefined) {
//       allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
//       allNodes[selectedNode].hiddenLabel = undefined;
//     }
//   }
//   else if (highlightActive === true) {
//     // reset all nodes
//     for (var nodeId in allNodes) {
//       allNodes[nodeId].color = undefined;
//       if (allNodes[nodeId].hiddenLabel !== undefined) {
//         allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
//         allNodes[nodeId].hiddenLabel = undefined;
//       }
//     }
//     highlightActive = false
//   }
//
//   // transform the object into an array
//   var updateArray = [];
//   for (nodeId in allNodes) {
//     if (allNodes.hasOwnProperty(nodeId)) {
//       updateArray.push(allNodes[nodeId]);
//     }
//   }
//   nodesDataset.update(updateArray);
// }
