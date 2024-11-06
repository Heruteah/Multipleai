const express = require('express');
const axios = require('axios');
const app = express();

const API_URL = 'https://api.airforce/v1/chat/completions';

const availableModels = [
    'claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-5-sonnet-20240620',
    'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'chatgpt-4o-latest', 'gpt-4',
    'gpt-4-turbo', 'gpt-4o-2024-05-13', 'gpt-4o-mini-2024-07-18', 'gpt-4o-mini',
    'gpt-4o-2024-08-06', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0125', 'gpt-3.5-turbo-1106',
    'gpt-4o', 'llama-3-70b-chat', 'llama-3-70b-chat-turbo', 'llama-3-8b-chat', 'llama-3-8b-chat-turbo',
    'llama-3-70b-chat-lite', 'llama-3-8b-chat-lite', 'llama-2-13b-chat', 'llama-3.1-405b-turbo',
    'llama-3.1-70b-turbo', 'llama-3.1-8b-turbo', 'LlamaGuard-2-8b', 'llamaguard-7b', 'Mixtral-8x7B-Instruct-v0.1',
    'Mixtral-8x22B-Instruct-v0.1', 'MythoMax-L2-13b-Lite', 'Mistral-7B-Instruct-v0.1', 'Mistral-7B-Instruct-v0.2',
    'Mistral-7B-Instruct-v0.3', 'openchat-3.5-0106', 'Llama-Vision-Free', 'Qwen1.5-72B-Chat', 'Qwen1.5-110B-Chat',
    'Qwen2-72B-Instruct', 'gemma-2b-it', 'dbrx-instruct', 'deepseek-coder-6.7b-base', 'deepseek-coder-6.7b-instruct',
    'deepseek-math-7b-instruct', 'Nous-Hermes-2-Mixtral-8x7B-DPO', 'hermes-2-pro-mistral-7b', 'openhermes-2.5-mistral-7b',
    'WizardLM-2-8x22B', 'SOLAR-10.7B-Instruct-v1.0', 'MythoMax-L2-13b', 'Llama-Guard-7b', 'gemma-2-9b-it',
    'gemma-2-27b-it', 'gemini-1.5-flash', 'gemini-1.5-pro', 'cosmosrp', 'Llama-3.2-90B-Vision-Instruct-Turbo',
    'gpt-4-turbo-2024-04-09', 'gpt-4-0125-preview', 'gpt-4-1106-preview', 'Meta-Llama-Guard-3-8B',
    'Llama-3.2-11B-Vision-Instruct-Turbo', 'Llama-Guard-3-11B-Vision-Turbo', 'Llama-3.2-3B-Instruct-Turbo',
    'Llama-3.2-1B-Instruct-Turbo', 'lfm-40b-moe', 'discolm-german-7b-v1', 'falcon-7b-instruct', 'llama-2-7b-chat-int8',
    'llama-2-7b-chat-fp16', 'neural-chat-7b-v3-1', 'phi-2', 'sqlcoder-7b-2', 'tinyllama-1.1b-chat', 'zephyr-7b-beta',
    'Qwen2.5-7B-Instruct-Turbo', 'Qwen2.5-72B-Instruct-Turbo', 'Llama 3.1 405B Instruct', 'Llama 3.1 70B Instruct',
    'Llama 3.1 8B Instruct', 'CodeLlama-34b-Instruct-hf', 'deepseek-llm-67b-chat', 'Llama-2-7b-chat-hf', 'any-uncensored'
];

app.get('/multipleai', async (req, res) => {
    const { q, model } = req.query;

    if (!q || !model) {
        return res.status(400).json({ 
            error: 'Missing required parameters: q and model',
            availableModels: availableModels 
        });
    }

    if (!availableModels.includes(model)) {
        return res.status(400).json({ 
            error: 'Invalid model specified',
            availableModels: availableModels
        });
    }

    const payload = {
        model,
        messages: [
            { role: 'system', content: 'System prompt (only the first message, once)' },
            { role: 'user', content: q }
        ],
        max_tokens: 2048,
        stream: false,
        temperature: 0.7,
        top_p: 0.5,
        top_k: 0
    };

    try {
        const response = await axios.post(API_URL, payload);
        const cleanedResponse = {
            model,
            response: response.data.choices[0].message.content
        };
        res.json(cleanedResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error communicating with the AI API' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});