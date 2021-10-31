node("ba007") {
    
  try {
    stage('Checkout') {
      checkout scm
    }
    stage('Environment') {
      sh 'git --version'
      echo "Branch: ${env.BRANCH_NAME}"
      sh 'printenv'
    }

    // stage('Build Docker test'){
    //  sh 'docker build -t ips-customer-success-portal-test -f Dockerfile.test --no-cache .'
    // }
    // stage('Docker test'){
    //   sh 'docker run --rm ips-customer-success-portal-test'
    // }
    // stage('Clean Docker test'){
    //   sh 'docker rmi ips-customer-success-portal-test'
    // }
    stage('Deploy'){
      if(env.BRANCH_NAME == 'master_staging'){
        sh 'docker build -f Dockerfile.prod -t ips-customer-success-portal --no-cache .'
        sh "docker tag ips-customer-success-portal reg.qpayi.com:5000/qpay/ips-customer-success-portal:${env.BRANCH_NAME}"
        sh "docker push reg.qpayi.com:5000/qpay/ips-customer-success-portal:${env.BRANCH_NAME}"
        sh "docker rmi -f ips-customer-success-portal reg.qpayi.com:5000/qpay/ips-customer-success-portal:${env.BRANCH_NAME}"
      }
    }
  }
  catch (err) {
    throw err
  }
}