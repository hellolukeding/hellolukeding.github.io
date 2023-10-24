# blog

# 静态站点部署
```
name: deploy

on:
  push:
    branches: [main] # 1.这里是你当前主分支的名字,我这里是main,你的可能是master
    paths-ignore:
      - README.md ## 2.表示该文件更新不会触发Github Actions部署,自行配置即可

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:

      - name: Checkout
        uses: actions/checkout@v3

      - name: Build
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
      - run: npm install # 安装依赖
      - run: npm run build # 打包


      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          publish_dir: ./build # 3.打包后文件的输出目录(根据你自己的项目情况而定)
          github_token: ${{ secrets.GITHUB_TOKEN }} # 4.刚才你C下来的仓库token秘钥!!!
          user_name: ${{ secrets.MY_USER_NAME }} # 不用改
          user_email: ${{ secrets.MY_USER_EMAIL }} # 不用改
          commit_message: 自动部署 # 5.部署时的 git 提交信息，自由填写
```