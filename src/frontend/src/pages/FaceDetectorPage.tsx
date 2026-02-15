import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ExternalLink, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FaceDetectorPage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Face Detector</h1>
        <p className="text-muted-foreground">
          Browser-based face detection feature
        </p>
      </div>

      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Feature Not Available</AlertTitle>
        <AlertDescription className="mt-2 text-base">
          The Face Detection feature requires the <code className="px-1.5 py-0.5 bg-destructive/20 rounded">face-api.js</code> package to be installed.
          Since package.json is read-only in this template, the dependency cannot be automatically added.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Installation Required
            </CardTitle>
            <CardDescription>
              Follow these steps to enable face detection functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Step 1: Install the Package</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Add the following dependency to <code className="px-1.5 py-0.5 bg-muted rounded text-xs">frontend/package.json</code>:
              </p>
              <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                <code>{`"face-api.js": "^0.22.2"`}</code>
              </pre>
              <p className="text-sm text-muted-foreground mt-2">
                Then run: <code className="px-1.5 py-0.5 bg-muted rounded text-xs">npm install</code>
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Step 2: Download Model Files</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Download the Tiny Face Detector model files from the official repository:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                <li><code className="text-xs">tiny_face_detector_model-weights_manifest.json</code></li>
                <li><code className="text-xs">tiny_face_detector_model-shard1</code> (binary file, ~190 KB)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Place these files in: <code className="px-1.5 py-0.5 bg-muted rounded text-xs">frontend/public/models/face-api/</code>
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Step 3: Rebuild the Application</h3>
              <p className="text-sm text-muted-foreground">
                After installing the package and downloading the models, rebuild the application to enable face detection.
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button asChild variant="outline" className="gap-2">
                <a
                  href="https://github.com/justadudewhohacks/face-api.js"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  View face-api.js Documentation
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planned Features</CardTitle>
            <CardDescription>
              Once the dependency is installed, these features will be available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span><strong>Webcam Detection:</strong> Real-time face detection with bounding boxes overlaid on your camera feed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span><strong>Photo Upload:</strong> Upload images and detect faces with confidence scores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span><strong>Privacy First:</strong> All detection happens locally in your browser - no data is sent to servers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span><strong>Fast Performance:</strong> Optimized Tiny Face Detector model for real-time detection (~10 FPS)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span><strong>Error Handling:</strong> Graceful handling of camera permissions and model loading failures</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-amber-600 dark:text-amber-400">Alternative: CDN Approach</CardTitle>
            <CardDescription>
              Not recommended for production, but can be used for testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you cannot modify package.json, you could load face-api.js from a CDN by adding this script tag to your HTML:
            </p>
            <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
              <code>{`<script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>`}</code>
            </pre>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Note:</strong> This approach requires internet connectivity, may have slower load times, 
                and requires code modifications to work with global script loading instead of ES modules.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
