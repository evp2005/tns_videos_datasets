from langchain_google_vertexai import ChatVertexAI

def count_tokens(text: str) -> int:
    model = ChatVertexAI(model="gemini-2.5-pro")
    token_count = model.get_num_tokens(text)
    return print(f"Tokens: {token_count}")