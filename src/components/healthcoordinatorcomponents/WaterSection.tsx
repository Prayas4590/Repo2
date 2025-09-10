import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Droplets, Camera, Wifi } from "lucide-react";

const paramList = [
  "Turbidity",
  "TDS",
  "pH",
  "Temperature",
  "Hardness",
  "Chlorine",
  "Nitrate",
  "Ammonia",
  "Fluoride",
  "Sulphate",
  "Iron",
  "Arsenic",
];

const WaterSection: React.FC = () => {
  const { toast } = useToast();

  const [location, setLocation] = useState("Hajo, Kamrup, Assam");
  const [source, setSource] = useState("Well");
  const [sampleId, setSampleId] = useState("");
  const [notes, setNotes] = useState("");

  const [params, setParams] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    paramList.forEach((p) => (initial[p] = ""));
    return initial;
  });

  const [labFile, setLabFile] = useState<File | null>(null);
  const [labName, setLabName] = useState("");

  const handleParamChange = (key: string, value: string) => {
    setParams((s) => ({ ...s, [key]: value }));
  };

  const clearOnSpot = () => {
    setSampleId("");
    setParams((s) => {
      const next = { ...s };
      Object.keys(next).forEach((k) => (next[k] = ""));
      return next;
    });
    setNotes("");
  };

  const submitOnSpot = (e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("On-spot submission", { location, source, sampleId, params, notes });
    toast({ title: "Submitted", description: "On-spot water test saved." });
    clearOnSpot();
  };

  const uploadReport = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!labFile) {
      toast({ title: "No file", description: "Choose a lab file to upload." });
      return;
    }
    console.log("Uploading report", labFile.name);
    toast({ title: "Uploaded", description: `${labFile.name} uploaded.` });
    setLabFile(null);
    setLabName("");
  };

  const connectIoT = () => {
    toast({ title: "Simulated", description: "Connected to local IoT sensor (simulated)." });
    setParams((s) => ({ ...s, Turbidity: "1.2", TDS: "150", pH: "7.1", Temperature: "24", Hardness: "120" }));
  };

  const recordFromIoT = () => {
    toast({ title: "Recorded", description: "Recorded current IoT values to on-spot test." });
    setSampleId(`IOT-${Date.now()}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Droplets className="h-6 w-6 text-coordinator" />
            <CardTitle>Water Quality Monitoring & Reporting</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* IoT Section (stacked) */}
          <section>
            <div>
              <p className="text-sm font-medium">IoT</p>
            </div>

            <div>
              <p className="text-sm font-medium">Location (selected)</p>
              <p className="text-xs text-text-secondary mt-1">{location}</p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-text-secondary" />
                </div>
                <div>
                  <p className="font-medium">IoT Device</p>
                  <p className="text-sm text-text-secondary">Connect a local IoT water sensor (simulated)</p>
                </div>
              </div>
              <div>
                <Button variant="outline" onClick={connectIoT}>Connect</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {paramList.slice(0, 6).map((p) => (
                <div key={p} className="rounded-lg border p-4 bg-background">
                  <p className="text-sm text-text-secondary">{p}</p>
                  <div className="mt-3 text-lg font-medium">{params[p] || "—"}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Button className="flex-1 bg-blue-500 text-white" onClick={recordFromIoT}>Record from IoT</Button>
              <Button variant="ghost">Clear</Button>
            </div>
          </section>

          <hr />

          {/* On-spot Section (stacked) */}
          <section>
            <div>
              <p className="text-sm font-medium">On-spot Water Test</p>
              <p className="text-xs text-text-secondary">Use rapid test kit or upload photo of color comparison</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); submitOnSpot(e); }} className="space-y-4 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div>
                  <Label>Source</Label>
                  <select className="w-full rounded-md border px-3 py-2" value={source} onChange={(e) => setSource(e.target.value)}>
                    <option>Well</option>
                    <option>Tap</option>
                    <option>River</option>
                    <option>Borehole</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paramList.map((p) => (
                  <div key={p}>
                    <Label>{p}</Label>
                    <Input value={params[p]} onChange={(e) => handleParamChange(p, e.target.value)} placeholder="—" />
                  </div>
                ))}
              </div>

              <div>
                <Label>Upload photo (color test / source)</Label>
                <div className="flex items-center gap-3 mt-2">
                  <label className="inline-flex items-center gap-2 rounded-md border px-4 py-2 cursor-pointer">
                    <Camera className="h-4 w-4" />
                    <span className="text-sm">Take/Choose Photo</span>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="" />
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit">Submit Test</Button>
                <Button variant="ghost" onClick={clearOnSpot}>Reset</Button>
              </div>
            </form>
          </section>

          <hr />

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Laboratory Report Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Lab name</Label>
              <Input value={labName} onChange={(e) => setLabName(e.target.value)} placeholder="Lab name" />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <Label>Choose file</Label>
              <Input type="file" onChange={(e: any) => setLabFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button onClick={(e) => uploadReport(e)}>Upload Report</Button>
            <Button variant="ghost" onClick={() => { setLabFile(null); setLabName(""); }}>Clear</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Archive</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        </CardContent>
      </Card>

    </div>
  );
};

export default WaterSection;
