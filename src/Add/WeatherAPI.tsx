import { DeviceData } from "../Auth/deviceSlice";
import { API_KEY } from "../weatherConfig";
import { AirQualityMetrics } from "./Device";
import { TimeSeriesData } from "../Auth/metricsSlice";
export async function getCurrentMetrics(
  device: DeviceData
): Promise<AirQualityMetrics | null> {
  try {
    const responseApi = await fetch(
      `https://api.weatherbit.io/v2.0/current/airquality?lat=${
        device!.deviceLat
      }&lon=${device!.deviceLong}&key=${API_KEY}`
    );

    if (!responseApi.ok) {
      throw new Error(`Error: ${responseApi.status}`);
    }

    const dataApi = await responseApi.json();

    if (dataApi.data && dataApi.data.length > 0) {
      const metrics = {
        city_name: dataApi.city_name,
        country_code: dataApi.country_code,
        pm25: dataApi.data[0].pm25,
        co: dataApi.data[0].co,
        aqi: dataApi.data[0].aqi,
      };
      return metrics;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch current air quality metrics:", error);
    throw error;
  }
}
export async function getCurrentTemp(device: DeviceData) {
  const responseTemp = await fetch(
    `https://api.weatherbit.io/v2.0/current?lat=${device?.deviceLat}&lon=${device?.deviceLong}&key=${API_KEY}`
  );
  if (!responseTemp.ok) {
    throw new Error(`Error: ${responseTemp.status}`);
  }
  const dataTemp = await responseTemp.json();
  if (dataTemp.data && dataTemp.data.length > 0) {
    const temp = dataTemp.data[0].temp;
    return temp;
  }
  throw new Error("No temperature data available");
}

export async function fetchTodayData(
  device: DeviceData
): Promise<TimeSeriesData> {
  const [airRes, tempRes] = await Promise.all([
    fetch(
      `https://api.weatherbit.io/v2.0/forecast/airquality?lat=${device.deviceLat}&lon=${device.deviceLong}&hours=24&key=${API_KEY}`
    ),
    fetch(
      `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${device.deviceLat}&lon=${device.deviceLong}&hours=24&key=${API_KEY}`
    ),
  ]);

  if (!airRes.ok) throw new Error(`AirQuality error: ${airRes.status}`);
  if (!tempRes.ok) throw new Error(`Temp error: ${tempRes.status}`);

  const airData = await airRes.json();
  const tempData = await tempRes.json();

  if (!airData.data?.length || !tempData.data?.length) {
    throw new Error("No today data available");
  }

  return {
    pm25: airData.data.map((item: any, index: number) => ({
      hour: index,
      value: item.pm25,
    })),
    co2: airData.data.map((item: any, index: number) => ({
      hour: index,
      value: item.co,
    })),
    aqi: airData.data.map((item: any, index: number) => ({
      hour: index,
      value: item.aqi,
    })),
    temp: tempData.data.map((item: any, index: number) => ({
      hour: index,
      value: item.temp,
    })),
  };
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function calculateDailyAverage(data: any[]) {
  const dailyAverages = [];
  const day = 24;
  for (let i = 0; i < data.length; i += day) {
    const chunk = data.slice(i, i + day);
    const sum = chunk.reduce((acc, item) => acc + item.value, 0);
    dailyAverages.push({
      hour: Math.floor(i / day),
      value: sum / chunk.length,
    });
  }
  return dailyAverages;
}
export async function fetchWeekData(
  device: DeviceData
): Promise<TimeSeriesData> {
  const today = new Date();
  const todayDate = formatDate(today);
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const lastWeekDate = formatDate(lastWeek);

  const [airRes, tempRes] = await Promise.all([
    fetch(
      `https://api.weatherbit.io/v2.0/history/airquality?lat=${device.deviceLat}&lon=${device.deviceLong}&start_date=${lastWeekDate}&end_date=${todayDate}&key=${API_KEY}`
    ),
    fetch(
      `https://api.weatherbit.io/v2.0/history/daily?lat=${device.deviceLat}&lon=${device.deviceLong}&start_date=${lastWeekDate}&end_date=${todayDate}&key=${API_KEY}`
    ),
  ]);

  if (!airRes.ok) throw new Error(`AirQuality error: ${airRes.status}`);
  if (!tempRes.ok) throw new Error(`Temp error: ${tempRes.status}`);

  const airData = await airRes.json();
  const tempData = await tempRes.json();
  if (!airData.data?.length || !tempData.data?.length) {
    throw new Error("No week data available");
  }
  const temps = tempData.data.map((item: any, index: number) => ({
    hour: index,
    value: item.temp,
  }));

  const pm25 = calculateDailyAverage(
    airData.data.map((item: any, index: number) => ({
      hour: index,
      value: item.pm25,
    }))
  );

  const co2 = calculateDailyAverage(
    airData.data.map((item: any, index: number) => ({
      hour: index,
      value: item.co,
    }))
  );

  const aqi = calculateDailyAverage(
    airData.data.map((item: any, index: number) => ({
      hour: index,
      value: item.aqi,
    }))
  );

  return { pm25, co2, aqi, temp: temps };
}
