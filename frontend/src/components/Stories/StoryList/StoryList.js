import React from 'react';

import StoryItem from './StoryItem/StoryItem';
import './StoryList.css';

const storyList = props => {
    const stories = props.stories.map(story => {
        return (
            <StoryItem 
                key={story._id}
                storyId={story._id}
                {...story}
            />
        );
    });

    return <div className="stories__list clearfix">{stories}</div>;
};

export default storyList;