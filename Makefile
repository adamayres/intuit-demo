.PHONY: install test coverage clean generate-fake-data train-model

install:
	python3 -m venv .venv && \
	source .venv/bin/activate && \
	pip install -r requirements.txt

test:
	source .venv/bin/activate && \
	pytest --cov=model model/tests --import-mode=importlib

coverage:
	source .venv/bin/activate && \
	.venv/bin/pytest --cov=model --cov-report=html model/tests --import-mode=importlib
	open htmlcov/index.html

clean:
	rm -rf generated htmlcov

generate-fake-data:
	.venv/bin/python -c "from model.generate_fake_data import generate_fake_data; generate_fake_data('./generated', 'training_data.csv', 500)"

train-model:
	.venv/bin/python model/train_model.py \
		--input-csv generated/training_data.csv \
		--output-model-path generated/model.ubj
