const axios = require('axios');

const getDistance = async (origin, destination) => {
    console.log(origin, destination);
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data; // Sử dụng response.data thay vì response.json()
        console.log(data);
        if (data.status === 'OK') {
            const distance = data.rows[0].elements[0].distance.value;
            return distance;
        } else {
            throw new Error('Không thể tính khoảng cách.');
        }
    } catch (error) {
        throw new Error(`Lỗi khi gọi API Google Maps: ${error.message}`);
    }
}

module.exports = { getDistance };
