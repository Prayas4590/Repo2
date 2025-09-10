import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const WaterSection: React.FC = () => {
  const { toast } = useToast();

  const [location, setLocation] = useState("");
  const [sampleId, setSampleId] = useState("");
  const [notes, setNotes] = useState("");

  const [turbidity, setTurbidity] = useState("");
  const [tds, setTds] = useState("");
  const [ph, setPh] = useState("");
  const [temperature, setTemperature] = useState("");
  const [hardness, setHardness] = useState("");
  const [chlorine, setChlorine] = useState("");

  const [labFile, setLabFile] = useState<File | null>(null);

  const handleSubmitTest = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      location,
      sampleId,
      turbidity,
      tds,
      ph,
      temperature,
      hardness,
      chlorine,
      notes,
      timestamp: new Date().toISOString(),
    };

    // For now just log. Integrations will be added later.
    console.log("Submitting on-site test:", payload);
    toast({ title: "On-site test submitted", description: "Water test data saved locally." });

    // reset small fields after submit
    setSampleId("");
    setTurbidity("");
    setTds("");
    setPh("");
    setTemperature("");
    setHardness("");
    setChlorine("");
    setNotes("");
  };

  const handleUploadReport = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!labFile) {
      toast({ title: "No file", description: "Please choose a laboratory report file to upload." });
      return;
    }

    // Placeholder upload behavior
    console.log("Uploading lab file:", labFile.name);
    toast({ title: "Report uploaded", description: `File ${labFile.name} uploaded.` });
    setLabFile(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Water Quality Monitoring & Reporting</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitTest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Village, Facility, Area" />
              </div>
              <div>
                <Label>Sample ID</Label>
                <Input value={sampleId} onChange={(e) => setSampleId(e.target.value)} placeholder="e.g. S-2025-001" />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
              </div>
            </div>

            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2">On-site Water Test</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Turbidity (NTU)</Label>
                  <Input value={turbidity} onChange={(e) => setTurbidity(e.target.value)} placeholder="e.g. 1.2" />
                </div>
                <div>
                  <Label>TDS (ppm)</Label>
                  <Input value={tds} onChange={(e) => setTds(e.target.value)} placeholder="e.g. 150" />
                </div>
                <div>
                  <Label>pH</Label>
                  <Input value={ph} onChange={(e) => setPh(e.target.value)} placeholder="e.g. 7.2" />
                </div>
                <div>
                  <Label>Temperature (°C)</Label>
                  <Input value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="e.g. 25" />
                </div>
                <div>
                  <Label>Hardness (mg/L)</Label>
                  <Input value={hardness} onChange={(e) => setHardness(e.target.value)} placeholder="e.g. 120" />
                </div>
                <div>
                  <Label>Free Chlorine (mg/L)</Label>
                  <Input value={chlorine} onChange={(e) => setChlorine(e.target.value)} placeholder="e.g. 0.2" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit">Submit Test</Button>
              <Button type="button" variant="ghost" onClick={() => {
                setSampleId(""); setTurbidity(""); setTds(""); setPh(""); setTemperature(""); setHardness(""); setChlorine(""); setNotes("");
              }}>Reset</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Laboratory Report Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Report File</Label>
              <Input type="file" onChange={(e: any) => setLabFile(e.target.files?.[0] ?? null)} />
            </div>
            <div>
              <Label>Comments</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional comments about the lab report" />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={(e) => handleUploadReport(e)}>Upload Report</Button>
            <Button variant="ghost" onClick={() => setLabFile(null)}>Clear</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Archive</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No archived reports yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterSection;
