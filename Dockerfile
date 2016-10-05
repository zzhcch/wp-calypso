#FROM       node:6.7.0-slim
FROM       wp-calypso-base
MAINTAINER Automattic

WORKDIR    /calypso
ENV        NODE_VERSION 6.7.0
ENV        NODE_PATH /calypso/server:/calypso/client

# Install base npm packages to take advantage of the docker cache
#COPY       ./package.json /calypso/package.json
#COPY       ./npm-shrinkwrap.json /calypso/npm-shrinkwrap.json
COPY       . /calypso

#RUN        mkdir -p /tmp
#COPY       ./env-config.sh /tmp/
RUN        true \
#		   && apt-get -y update \
#		   && apt-get -y install \
#		         git \
#		         make \
#		   && bash /tmp/env-config.sh \
#		   && rm -rf node_modules \
#		   # sometimes "npm install" fails the first time when the
#		   # cache is empty, so we retry once if it failed
#		   && npm install --production || npm install --production \
		   && CALYPSO_ENV=wpcalypso make build-wpcalypso \
	       && CALYPSO_ENV=horizon make build-horizon \
	       && CALYPSO_ENV=stage make build-stage \
	       && CALYPSO_ENV=production make build-production \
#	       && apt-get remove git -y \
#	       && rm -rf /var/lib/apt/lists/* \
#		   && chown -R nobody /calypso \
           && true

USER       nobody
CMD        NODE_ENV=production node build/bundle-$CALYPSO_ENV.js
