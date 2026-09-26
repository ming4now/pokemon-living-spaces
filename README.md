# Pokémon Living Spaces

五个宝可梦主题室内空间的交互式 3D 展厅：冰系、妖精系、毒系、虫系与火系。

进入首页后选择房间，可以旋转、缩放、查看家具、调整昼夜光照与灯具，并下载完整 GLB 模型。冰系空间另有配乐昼夜影片。

## 浏览与托管

这是纯静态站点，仓库已包含 GitHub Actions 自动部署工作流 `.github/workflows/deploy.yml`。首次发布到新仓库时：

1. 打开仓库的 **Settings → Pages → Build and deployment**，将 **Source** 设为 **GitHub Actions**。
2. 向 `main` 分支推送提交，或打开 **Actions → Deploy showroom to GitHub Pages → Run workflow** 手动运行部署。
3. 等待部署成功，在 **Settings → Pages** 或该次 Actions 部署结果中打开站点链接。以后每次推送到 `main` 都会自动更新网站。

所有站内资源均采用相对路径，支持项目站点的仓库子路径，无需服务器程序或第三方数据服务。部署会发布仓库根目录的静态站点，`.nojekyll` 保留静态资源原样发布。

本版本需要 HTTP 或 HTTPS 服务；请通过网站链接访问，或在本目录运行 `python3 -m http.server 8080` 预览。原有离线单文件版本不包含在本仓库中。

## 模型资源

为适应仓库单文件大小限制，模型按不超过 32 MiB 分块存储。进入房间后仅下载所选房间，显示读取进度，再恢复原始 GLB。HTTPS 下浏览器会校验 SHA-256，下载按钮导出重组后的完整原始文件。

每个房间的 `assets/model-manifest.json` 记录原模型名称、字节数、SHA-256 与分块清单。分块没有改变模型几何、材质或纹理，未压缩或简化 3D 内容。完整房间首次加载约需 27–130 MiB，加载时间取决于网络和设备性能。

仅公开展厅所需页面、模型资源、封面和配乐视频；不包含本机路径、Blender 工程、制作记录或原始参考图。

Three.js 使用 MIT 许可，说明见 `THIRD_PARTY_LICENSES.txt`。本项目为非官方宝可梦主题创作，相关角色与名称属于其各自权利人。
