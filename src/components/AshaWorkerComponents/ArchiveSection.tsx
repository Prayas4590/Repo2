import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ArchiveSection({ entries = [], onClear = ()=>{} }: any){
  const accepted = entries.filter((e:any)=> e.status === 'accepted').length;
  const inspected = entries.filter((e:any)=> e.status === 'inspected').length;

  return (
    <div>
      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center gap-2">Archive</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="label-medium">Stats</p>
              <p className="body-small text-text-secondary">Accepted: {accepted} • Inspected: {inspected}</p>
            </div>
            <Button variant="ghost" onClick={()=>onClear()}>Clear</Button>
          </div>

          <div className="space-y-2">
            {entries.length === 0 && <p className="body-medium text-text-secondary">No archived items.</p>}
            {entries.map((e:any)=> (
              <div key={e.id} className="p-3 rounded-md bg-surface-variant/20 border border-divider">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="label-large">{e.name} <span className="text-xs text-text-secondary">({e.userId})</span></p>
                    <p className="body-small text-text-secondary">{(e.location as any)?.text ?? ''}</p>
                  </div>
                  <Badge className="bg-muted/10">{e.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
