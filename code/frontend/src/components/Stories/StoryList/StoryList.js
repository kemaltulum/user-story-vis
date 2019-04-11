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

    return <ul className="stories__list">{stories}</ul>;
};

export default storyList;