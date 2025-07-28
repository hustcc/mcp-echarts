# Troubleshooting Empty Results

If you're getting empty results when using the mcp-echarts tool, follow these steps to diagnose the issue:

## 1. Enable Debug Logging

Set the environment variable to enable debug logging:

```bash
export DEBUG_MCP_ECHARTS=true
```

Then restart your MCP server. The debug information will be written to stderr and won't interfere with the MCP protocol.

## 2. Test Your Input JSON

Make sure your ECharts option JSON is valid. Test it with this command:

```bash
node -e "console.log(JSON.parse('YOUR_JSON_STRING_HERE'))"
```

Example valid JSON:
```json
{"title":{"text":"示例柱状图"},"tooltip":{},"legend":{"data":["销量"]},"xAxis":{"type":"category","data":["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]},"yAxis":{"type":"value"},"series":[{"name":"销量","type":"bar","data":[120,200,150,80,70,110]}]}
```

## 3. Check MCP Client Compatibility

Some MCP clients might not display images properly. Try:

1. **Different output types**: Try `outputType: "svg"` or `outputType: "option"` instead of `"png"`
2. **Different clients**: Test with different MCP-compatible applications

## 4. MinIO Configuration (if using URLs)

If you have MinIO configured, make sure these environment variables are set:

```bash
MINIO_ENDPOINT=your-minio-endpoint
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET_NAME=mcp-echarts
```

## 5. Test Directly

You can test the tool directly with Node.js:

```bash
node -e "
const { generateEChartsTool } = require('./build/tools/echarts.js');
generateEChartsTool.run({
  echartsOption: '{\"title\":{\"text\":\"Test\"},\"series\":[{\"type\":\"bar\",\"data\":[1,2,3]}]}',
  outputType: 'png'
}).then(result => {
  console.log('Result type:', result.content[0].type);
  console.log('Has data:', !!result.content[0].data);
  console.log('Data length:', result.content[0].data?.length || 0);
}).catch(console.error);
"
```

## 6. Common Issues

### Issue: Empty string result
**Cause**: Client not handling base64 image data properly
**Solution**: Try `outputType: "svg"` for text-based output

### Issue: "Invalid ECharts option" error
**Cause**: JSON string is malformed or empty
**Solution**: Validate your JSON string with a JSON validator

### Issue: Images not displaying in client
**Cause**: Client doesn't support image content type
**Solution**: Use `outputType: "svg"` or configure MinIO for URL-based images

## 7. Verify Tool Registration

Make sure the tool is properly registered by checking available tools in your MCP client. The tool should be listed as `generate_echarts`.

## 8. Contact Support

If none of the above helps, please provide:
1. Your input JSON string
2. Debug logs (with `DEBUG_MCP_ECHARTS=true`)
3. MCP client you're using
4. Expected vs actual behavior
