import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

export type DailyWeather = {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rain';
  temperatureC: number;
  humidity: number; // %
  rainChance: number; // %
  windKph: number;
  advisory?: string;
};

const iconFor = (c: DailyWeather['condition']) => c === 'rain' ? <CloudRain className="h-5 w-5 text-info" /> : c === 'cloudy' ? <Cloud className="h-5 w-5 text-text-secondary" /> : <Sun className="h-5 w-5 text-warning" />;

export default function DailyWeatherCard() {
  const [weather, setWeather] = useState<DailyWeather | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('daily_weather');
      if (saved) {
        setWeather(JSON.parse(saved));
        return;
      }
    } catch {}
    const today: DailyWeather = {
      date: new Date().toDateString(),
      condition: 'rain',
      temperatureC: 29,
      humidity: 82,
      rainChance: 70,
      windKph: 14,
      advisory: 'High chance of rain. Keep drinking water covered and avoid flooding areas.'
    };
    setWeather(today);
  }, []);

  if (!weather) return null;

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2">
          {iconFor(weather.condition)}
          Daily Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 body-medium text-text-secondary">
        <div>
          <p className="label-medium text-text-primary">{weather.date}</p>
          <p className="mt-1">Temp: {weather.temperatureC}°C</p>
          <p>Humidity: {weather.humidity}%</p>
        </div>
        <div>
          <p>Rain chance: {weather.rainChance}%</p>
          <p className="flex items-center gap-1"><Wind className="h-4 w-4" /> {weather.windKph} km/h</p>
        </div>
        {weather.advisory && (
          <div className="col-span-2 p-2 bg-muted/30 rounded-lg">{weather.advisory}</div>
        )}
      </CardContent>
    </Card>
  );
}
