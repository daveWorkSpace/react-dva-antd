# submodules 说明

    提供开发环境的模块热加载。

    目录要求
        要求所有的项目使用一级目录排列。如下：
            aoao-apps-vendor
            aoao-apps-vendor-account
            aoao-apps-vendor-business
            aoao-apps-vendor-finance
            aoao-apps-vendor-statictics
            aoao-apps-vendor-tms
            aoao-core-api-service
            aoao-core-react-components
            aoao-style-themes

    配置文件modules.config说明
        需要加载的模块，每行一个，将模块对应目录名称，写入modules.config中。

    自动配置
        npm run load-module
