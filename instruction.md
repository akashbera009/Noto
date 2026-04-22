source venv/bin/activate
cd noto_server
uvicorn main:app --reload

# for ai models 
transformers
langchain
langchain-huggingface

pip install transformers==4.41.2
pip install torch sentencepiece


# for login with huggingface
hf auth login
token : HUGGING_FACE_TOKEN