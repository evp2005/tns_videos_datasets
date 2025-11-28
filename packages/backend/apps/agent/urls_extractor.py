from langchain_community.document_loaders import WebBaseLoader

def extract_info_urls(url : str):
    loader = WebBaseLoader(web_paths=(url,))
    url_data = loader.load()
    return str(url_data)
