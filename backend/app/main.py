from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Finova AI Backend Running"}