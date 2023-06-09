import { Suspense } from "react";
import ManualPage from "../../../work/the-manual/page";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function Page() {
  return (
    <>
      <Dialog open={true}>
        <DialogContent>
          <Suspense fallback={<div>Loading...</div>}>
            {await ManualPage()}
          </Suspense>
          {/* <DialogHeader>
            <DialogTitle>HEJ</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
