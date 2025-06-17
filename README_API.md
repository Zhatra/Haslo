# vLLM API

Una API simple para servir modelos de lenguaje usando vLLM y Flask.

## Instalación

1. Instalar dependencias:

```bash
pip install -r requirements.txt
```

2. Asegúrate de tener suficiente memoria GPU para el modelo seleccionado.

## Ejecución

```bash
python api.py
```

Por defecto, la API se ejecutará en `http://localhost:5000`.

## Endpoints

### 1. Generar texto

**Endpoint:** `/generate`
**Método:** POST

**Parámetros:**
- `prompt` (string): El texto de entrada para generar la respuesta
- `max_tokens` (int, opcional): Número máximo de tokens a generar (default: 256)
- `temperature` (float, opcional): Controla la aleatoriedad (default: 0.7)
- `top_p` (float, opcional): Probabilidad acumulativa para muestreo nucleus (default: 0.9)
- `top_k` (int, opcional): Número de tokens más probables a considerar (default: 40)

**Ejemplo de solicitud:**

```json
{
  "prompt": "Explica la inteligencia artificial en términos simples",
  "max_tokens": 150,
  "temperature": 0.8
}
```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "result": "La inteligencia artificial es como enseñar a las computadoras a pensar y aprender...",
  "usage": {
    "prompt_tokens": 7,
    "completion_tokens": 25,
    "total_tokens": 32
  }
}
```

### 2. Generar texto en lote

**Endpoint:** `/batch-generate`
**Método:** POST

**Parámetros:**
- `prompts` (lista de strings): Lista de prompts para generar respuestas
- `max_tokens` (int, opcional): Número máximo de tokens a generar (default: 256)
- `temperature` (float, opcional): Controla la aleatoriedad (default: 0.7)
- `top_p` (float, opcional): Probabilidad acumulativa para muestreo nucleus (default: 0.9)
- `top_k` (int, opcional): Número de tokens más probables a considerar (default: 40)

**Ejemplo de solicitud:**

```json
{
  "prompts": [
    "¿Cuál es la capital de Francia?",
    "Escribe un poema corto sobre la naturaleza"
  ],
  "max_tokens": 100
}
```

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "results": [
    {
      "prompt": "¿Cuál es la capital de Francia?",
      "generated_text": "La capital de Francia es París.",
      "tokens": 7
    },
    {
      "prompt": "Escribe un poema corto sobre la naturaleza",
      "generated_text": "Verdes hojas danzan,\nAgua clara que fluye,\nPaz en el bosque.",
      "tokens": 15
    }
  ]
}
```

### 3. Verificación de salud

**Endpoint:** `/health`
**Método:** GET

**Ejemplo de respuesta:**

```json
{
  "status": "healthy",
  "model": "meta-llama/Meta-Llama-3-8B-Instruct"
}
```

## Despliegue en producción

Para desplegar en producción, se recomienda usar Gunicorn:

```bash
gunicorn -w 1 -b 0.0.0.0:5000 api:app
```

Nota: Para modelos grandes, es recomendable usar solo 1 worker (`-w 1`) debido a los requisitos de memoria. 