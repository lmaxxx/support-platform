import {components} from "../../_generated/api";
import {RAG} from "@convex-dev/rag";
import {cohere} from "@ai-sdk/cohere";


const rag = new RAG(components.rag, {
  textEmbeddingModel: cohere.textEmbeddingModel('embed-multilingual-v3.0'),
  embeddingDimension: 1024 // Cohere multilingual uses 1024
})

export default rag;