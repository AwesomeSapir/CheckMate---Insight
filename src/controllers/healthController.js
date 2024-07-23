const healthCheck = async (req, res) => {
    const healthStatus = {
        status: "ok",
        timestamp: new Date().toISOString()
    };
    
    console.log(`Health Check - Status: ${healthStatus.status}, Timestamp: ${healthStatus.timestamp}`);
    
    res.status(200).json(healthStatus);
}

module.exports = {
    healthCheck,
};