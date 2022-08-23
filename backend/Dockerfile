FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONNUNBUFFERED=1
WORKDIR /api
COPY requirements.Txt /api/
RUN pip install -r requirements.txt
COPY . /api/