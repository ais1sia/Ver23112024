import React from 'react';
import { useFetchRecommendationsQuery } from './recommendationsApiSlice';

const RecommendationsList = ({ userId }) => {
    const { data: recommendations = [], isLoading, isError } = useFetchRecommendationsQuery(userId);

    if (isLoading) return <p>Loading recommendations...</p>;
    if (isError) return <p>Error fetching recommendations.</p>;

    return (
        <div>
            <h2>Recommended Materials</h2>
            <ul>
                {recommendations.map(material => (
                    <li key={material._id}>
                        <h3>{material.title}</h3>
                        <p>{material.short}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecommendationsList;
