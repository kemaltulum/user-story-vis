let d3Tree = {};
d3Tree.create = function (el, props, state) {
    let svg = d3.select(el).append('svg')
        .attr('width', props.width)
        .attr('height', props.height);

    this.width = props.width;
    this.height = props.height;

    this.update(el, state);
};

d3Tree.update = function (el, state) {
    this._drawTree(el, state.data);
};

d3Tree._drawTree = function (el, data) {
    let tree = d3.layout.tree().size([500, 250]);
    let svg = d3.select(el).select('svg');
    let nodes = tree.nodes(data);
    let g = svg.selectAll('g.node');
    let node = g.data(nodes);
    node.enter().append('svg:g')
        .attr('class', 'node')
        .attr('transform', (d) => {
            return `translate(${d.x},${d.y + 10})`;
        })
        .append("svg:circle")
        .attr("r", 6);

    node.transition().attr('transform', (d) => `translate(${d.x},${d.y})`);

    node.exit().remove();

    let p = svg.selectAll('path.link');
    let link = p.data(tree.links(nodes));
    link.enter().insert("svg:path", "g")
        .attr('class', 'link')
        .attr('d', d3.svg.diagonal().projection(function (d) {
            return [d.x, d.y];
        }));

    link.transition().attr('d', d3.svg.diagonal().projection(function (d) {
        return [d.x, d.y];
    }))

    link.exit().remove();
};

class TreeChart extends React.Component {

    componentDidMount() {
        var el = ReactDOM.findDOMNode(this);
        d3Tree.create(el, {
            width: '100%',
            height: '300px'
        }, this.getChartState());
    }

    componentDidUpdate() {
        var el = ReactDOM.findDOMNode(this);
        d3Tree.update(el, this.getChartState());
    }

    getChartState() {
        return {
            data: this.props.data
        };
    }

    render() {
        return (
            <div className="TreeChart"></div>
        );
    }
}

class App extends React.Component {
    static propTypes = {
        data: React.PropTypes.object
    };

    componentDidMount() {

        console.log(this.props);

        const width = this.props.width;
        const height = this.props.height;

        // append the svg object to the body of the page
        const svg = d3.select("#tree")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(40,0)");  // bit of margin on the left = 40

        const data = this.props.data;

        // Create the cluster layout:
        var cluster = d3.cluster()
            .size([height, width - 180]);  // 100 is the margin I will have on the right side

        // Give the data to this cluster layout:
        var root = d3.hierarchy(data, function (d) {
            return d.children;
        });
        cluster(root);
        console.log(root);
        const nodeWidth = 80;
        const nodeHeight = 20;

        // Add the links between nodes:
        svg.selectAll('path')
            .data(root.descendants().slice(1))
            .enter()
            .append('path')
            .attr("d", function (d) {
                let dx = d.x;
                let dy = d.y;
                let dpx = d.parent.x;
                let dpy = d.parent.y;
                return "M" + dy + "," + dx
                    + "C" + (dpy + 50) + "," + dx
                    + " " + (dpy + 150) + "," + dpx // 50 and 150 are coordinates of inflexion, play with it to change links shape
                    + " " + dpy + "," + dpx;
            })
            .style("fill", 'none')
            .attr("stroke", '#ccc');


        // Add a circle for each node.
        svg.selectAll("g")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")"
            })
            .append("rect")
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            //.attr("x", -nodeWidth/2)
            .attr("y", -nodeHeight / 2)
            .style("fill", "#69b3a2")
            .attr("stroke", "black")
            .style("stroke-width", 2);

        svg.selectAll("g")
            .append("text")
            .data(root.descendants())
            .text(function (d) { return d.data.name; })
            .attr("x", "5")
            .attr("y", "2")
            .style("font-size", "12px");


    }
    constructor() {
        super();
        this.state = {
            data: {
                "children": [{
                    "children": [{}, {}]
                }, {
                    "children": [{}, {}, {}]
                }, {
                    "children": [{
                        "children": [{}, {}]
                    }]
                }]
            }
        };
        this.addNode = this.addNode.bind(this);
        this.removeNode = this.removeNode.bind(this);
    }

    addNode() {
        this.state.data.children = this.state.data.children || [];
        this.state.data.children.push({});
        this.setState({
            data: this.state.data
        });
    }

    removeNode() {
        this.state.data.children.pop();
        this.setState({
            data: this.state.data
        });
    }
    render() {
        return (
            <div className="App">
                <TreeChart data={this.state.data} />
                <button onClick={this.addNode}>add node</button>
                <button onClick={this.removeNode}>remove node</button>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('react-app'));