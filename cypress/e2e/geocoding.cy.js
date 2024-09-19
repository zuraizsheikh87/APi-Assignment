describe('OpenWeather Geocoding API', () => {
    const apiKey = 'f897a99d971b5eef57be6fafa0d83239'; 

    const getLocationInfo = (location) => {
        return cy.request({
            method: 'GET',
            url: `http://api.openweathermap.org/geo/1.0/direct`,
            qs: {
                q: location,
                appid: apiKey,
            },
        });
    };

    const getLocationInfoByZip = (zip) => {
        return cy.request({
            method: 'GET',
            url: `http://api.openweathermap.org/geo/1.0/zip`,
            qs: {
                zip: `${zip},US)`,
                appid: apiKey,
            },
        });
    };

    const checkLocation = (location) => {
        return getLocationInfo(location).then((response) => {
            if (response.body.length > 0) {
                return response.body[0];
            } else {
                return getLocationInfoByZip(location).then((zipResponse) => {
                    return zipResponse.body;
                });
            }
        });
    };

    it('should return valid location data for a city', () => {
        const location = 'London';

        checkLocation(location).then((data) => {
            expect(data).to.have.property('name', 'London');
            expect(data).to.have.property('state', 'England');
            expect(data).to.have.property('country', 'GB');
            expect(data).to.have.property('lat');
            expect(data).to.have.property('lon');
        });
    });

    it('should return valid location data for a zip code', () => {
        const location = 'E14';

        checkLocation(location).then((data) => {
            expect(data).to.have.property('name');
            expect(data).to.have.property('state');
            expect(data).to.have.property('country', 'SO');
            expect(data).to.have.property('lat');
            expect(data).to.have.property('lon');
        });
    });
});