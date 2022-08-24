FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONNUNBUFFERED=1
WORKDIR /api
COPY requirements.txt /api/
RUN pip install -r requirements.txt
COPY . /api/
WORKDIR /api/CoreRoot
CMD ["python","manage.py","runserver"]