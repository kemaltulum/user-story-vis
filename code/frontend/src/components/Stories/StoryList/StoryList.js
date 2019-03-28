import React from 'react';

import StoryItem from './StoryItem/StoryItem';
import './StoryList.css';

const storyList = props => {
    const stories = props.stories.map(story => {
        return (
            <StoryItem 
                key={story._id}
                storyId={story._id}
                fullText={story.full_text}
                actor={story.actor}
                action={story.action}
                benefit={story.benefit}
                isParsed={story.is_parsed}
            />
        );
    });

    return <ul className="stories__list">{stories}</ul>;
};

export default storyList;