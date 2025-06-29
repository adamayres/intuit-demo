.PHONY: generate-fake-data test

generate-fake-data:
	.venv/bin/python -c "from model.generate_fake_data import generate_fake_data; generate_fake_data('./generated', 'training_data.csv', 500)"

test:
	source .venv/bin/activate && \
	pytest --cov=model model/tests --import-mode=importlib

coverage:
	source .venv/bin/activate && \
	.venv/bin/pytest --cov=model --cov-report=html model/tests --import-mode=importlib
	open htmlcov/index.html

clean:
	rm -rf generated htmlcov
