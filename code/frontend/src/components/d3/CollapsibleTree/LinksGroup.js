import React, { Component, Fragment } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import { _ } from 'lodash';

export default class LinksGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oldLinksList: null
        };
    }

    diagonal(d, w, h) {
        let dsy = d.source.y + w;
        let dsx = d.source.x + h / 2;
        let dtx = d.target.x + h / 2;
        let dty = d.target.y;
        return "M" + dsy + "," + dsx
            + "C" + (dsy + dty) / 2 + "," + dsx
            + " " + (dsy + dty) / 2 + "," + dtx
            + " " + dty + "," + dtx;
    }


    render() {
        const { linksList } = this.props;
        const nodeWidth = 110;
        const nodeHeight = 24;
        const linksConfig = linksList.map(link => ({
            key: `${link.source.x}-${link.target.y}-${link.source.y}-${link.target.x}`,
            style: {
                sourceX: spring(link.source.x),
                sourceY: spring(link.source.y),
                targetX: spring(link.target.x),
                targetY: spring(link.target.y)
            },
            data: link
        }));
        const defaultLinksConfig = linksList.map(link => ({
            key: `${link.source.x}-${link.target.y}-${link.source.y}-${link.target.x}`,
            style: {
                sourceX: link.source.x,
                sourceY: link.source.y,
                targetX: link.source.x,
                targetY: link.source.y
            },
            data: link
        }));

        const links = (
            <TransitionMotion
                willEnter={this.linkWillEnter.bind(this)}
                willLeave={this.linkWillLeave.bind(this)}
                defaultStyles={defaultLinksConfig}
                styles={linksConfig}>
                {
                    linksConfig => {
                        return (
                            <g transform="translate(0,0)">
                                {
                                    linksConfig.map(
                                        config => {
                                            return (
                                                <path key={config.key} fill="none" stroke="black" className="link"
                                                    d={this.diagonal(config.data, nodeWidth, nodeHeight)} />
                                            );
                                        }
                                    )
                                }
                            </g>
                        );
                    }
                }
            </TransitionMotion>
        );

        return links;
    }


    componentWillReceiveProps() {
        const oldLinksList = this.props.linksList;
        this.setState({ oldLinksList });
    }


    linkWillEnter(link) {
        const linksList = this.state.oldLinksList || this.props.linksList;
        const { x, y } = this.findSource(link.data.source, linksList);

        return {
            sourceX: x,
            sourceY: y,
            targetX: x,
            targetY: y
        };
    }


    linkWillLeave(link) {
        const { x, y } = this.findSource(link.data.source, this.props.linksList);
        return {
            sourceX: spring(x),
            sourceY: spring(y),
            targetX: spring(x),
            targetY: spring(y)
        };
    }


    findSource(node, linksList) {
        let source = _.find(linksList, item => item.target.id == node.id);
        if (source) {
            return source.target;
        }
        if (!node.parent) {
            return node;
        }
        return this.findSource(node.parent, linksList);
    }
};