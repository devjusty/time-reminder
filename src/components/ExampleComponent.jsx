import React from 'react';

const ExampleComponent = ({ title, description }) => {
    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-700">{description}</p>
        </div>
    );
};

export default ExampleComponent;