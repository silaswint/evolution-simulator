module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    node: "current",
                },
            },
        ],
        "@babel/preset-react",
        "@babel/preset-typescript",
    ],
    plugins: [
        "react-refresh/babel",
        // Weitere Plugins können nach Bedarf hinzugefügt werden
    ],
};
