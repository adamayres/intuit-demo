.PHONY: install test coverage clean generate-fake-data train-model prediction-service

install:
	python3 -m venv .venv && \
	source .venv/bin/activate && \
	pip install -r requirements.txt

test:
	source .venv/bin/activate && \
	pytest \
	  --cov=model \
	  --cov=prediction_service \
	  model prediction_service/routers \
	  --cov-config=.coveragerc \
	  --import-mode=importlib

coverage:
	source .venv/bin/activate && \
	pytest \
	  --cov=model \
	  --cov=prediction_service \
	  model prediction_service/routers \
	  --cov-report=html \
	  --cov-config=.coveragerc \
	  --import-mode=importlib && \
	  open htmlcov/index.html

clean:
	rm -rf generated htmlcov

generate-fake-data:
	.venv/bin/python -c "from model.generate_fake_data import generate_fake_data; generate_fake_data('./generated', 'training_data.csv', 500)"

train-model:
	.venv/bin/python model/train_model.py \
		--input-csv generated/training_data.csv \
		--output-model-path generated/model.ubj \
		--output-model-features-path generated/model-features.joblib \
		--output-delays-path generated/training-delays.npy

prediction-service:
	source .venv/bin/activate && \
	uvicorn prediction_service.app:app --reload --host 0.0.0.0 --port 8000
