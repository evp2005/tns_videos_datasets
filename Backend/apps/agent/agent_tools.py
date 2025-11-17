from langchain_community.document_loaders import WebBaseLoader
from langchain_google_vertexai import ChatVertexAI

def extract_info_urls(url : str):
    loader = WebBaseLoader(web_paths=(url,))
    url_data = loader.load()
    return str(url_data)

def count_tokens(text: str) -> int:
    model = ChatVertexAI(model="gemini-2.5-pro")
    token_count = model.get_num_tokens(text)
    return print(f"Tokens: {token_count}")
