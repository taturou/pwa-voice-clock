# ベースイメージとして Node.js 開発コンテナを使用
FROM mcr.microsoft.com/devcontainers/javascript-node:0-20

# 必要に応じて追加パッケージをインストール
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# インタラクティブな apt 動作に戻す
ENV DEBIAN_FRONTEND=dialog
