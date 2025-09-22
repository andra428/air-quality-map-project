export interface Location {
  address: string;
  coords: {
    lat: number;
    long: number;
  };
}
export async function getLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject("Browser does not support geolocation.");
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `/api/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "User-Agent": "Your-App-Name/1.0",
              },
            }
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          const data = await response.json();
          if (data.address) {
            const road = data.address.road || "";
            const city = data.address.city || "";
            const country = data.address.country || "";
            const address = `${road}, ${city}, ${country}`
              .split(", ")
              .filter((part) => part)
              .join(", ");
            resolve({
              address: address,
              coords: {
                lat: latitude,
                long: longitude,
              },
            });
          } else {
            reject("The address could not be found.");
          }
        } catch (error: any) {
          reject("The address could not be found.");
        }
      },
      (error) => {
        reject(`Geolocation error: ${error.message}`);
      }
    );
  });
}

export async function getCoordsFromAddress(
  address: string
): Promise<Location[]> {
  return new Promise(async (resolve, reject) => {
    const allPlaces: Location[] = [];
    try {
      if (!address || address.trim() === "") {
        return reject("Address cannot be empty");
      }
      const response = await fetch(`/api/search?format=jsonv2&q=${address}`, {
        headers: {
          "User-Agent": "Your-App-Name/1.0",
        },
      });
      if (!response.ok) {
        return reject(`Error: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        for (let i: number = 0; i < data.length; i++) {
          const displayName = data[i].display_name;
          const latitude = data[i].lat;
          const longitude = data[i].lon;
          const addressItem: Location = {
            address: displayName,
            coords: {
              lat: parseFloat(latitude),
              long: parseFloat(longitude),
            },
          };
          allPlaces.push(addressItem);
        }
        resolve(allPlaces);
      } else {
        return reject("No results found for this address");
      }
    } catch (error: any) {
      reject(`Geolocation error: ${error.message}`);
    }
  });
}
