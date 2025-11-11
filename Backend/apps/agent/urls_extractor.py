from langchain_community.document_loaders import WebBaseLoader

def extract_title_urls(url : str):
    loader = WebBaseLoader(web_paths=(url,))
    url_data = loader.load()
    title_url_video = url_data[0].metadata['title']
    return str(title_url_video)

