async function recognize(base64, lang, options) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;
    let { model = "qwen-vl-plus", apiKey } = config;

    const requestPath = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }

    const body = {
        model: model,
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "任务: 文本扫描提取\n\n工作模式:\n- 逐字逐句扫描文本\n- 完全保留原始文字，不做分析和总结\n- 将图片视为文档页面\n\n处理要求:\n1. 文本处理\n   - 严格按照原文字序提取\n   - 保持标点符号和格式不变\n   - 不省略任何文字内容\n\n2. 图片处理\n   - 每张图片视为独立页面\n   - 与文本页面同等对待\n   - 保持原有顺序编号\n\n3. 文档整体性\n   - 维持页面间逻辑顺序\n   - 保持语义连贯性\n   - 完整还原文档结构\n\n输出要求:\n- 完整提取所有内容\n- 保持文档原貌\n- 不加入主观分析"
                    },
                    {
                        "type": "image_url",
                        "image_url": { "url": `data:image/png;base64,${base64}` }
                    },
                ]
            }
        ]
    };

    let res = await fetch(requestPath, {
        method: 'POST',
        url: requestPath,
        headers: headers,
        body: {
            type: "Json",
            payload: body
        }
    });

    if (res.ok) {
        let result = res.data;
        return result?.choices?.[0]?.message?.content || "No text found";
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }
}

