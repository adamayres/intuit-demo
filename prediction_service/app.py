from fastapi import FastAPI
from prediction_service.routers import predict

app = FastAPI()
app.include_router(predict.router)
