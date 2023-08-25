"use client";
type Props = {};
const CreateEmbedding = (props: Props) => {
    async function createIndexAndEmbeddings() {
        try {
            console.log("started");
            const result = await fetch("/api/createEmbeddings", {
                method: "POST",
            });
            const json = await result.json();
            console.log("Result: ", json);
        } catch (err) {
            console.log("Error: ", err);
        }
    }
    return (
        <div className="absolute flex flex-col -translate-x-1/2 mt-8 -translate-y-1/2 top-1/2 left-1/2">
            <button onClick={createIndexAndEmbeddings}>
                Create Index and Embedding
            </button>
        </div>
    );
};
export default CreateEmbedding;
