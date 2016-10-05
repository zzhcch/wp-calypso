FROM       node:6.7.0-slim
MAINTAINER Automattic

WORKDIR    /calypso
ENV        NODE_VERSION=6.7.0 \
           NODE_PATH=/calypso/server:/calypso/client

COPY       ./package.json \
           ./npm-shrinkwrap.json \
           ./env-config.sh \
           /calypso/

RUN        true \
           && mv /calypso/env-config.sh /tmp/env-config.sh \
           && bash /tmp/env-config.sh \
           && apt-get -y update \
           && apt-get -y install \
                 git \
                 make \
           && npm install --production || npm install --production \
           && apt-get remove -y \
                 git \
		   && apt-get autoremove -y \
           && rm -rf /var/lib/apt/lists/* \
           && chown -R nobody /calypso \
           && true
