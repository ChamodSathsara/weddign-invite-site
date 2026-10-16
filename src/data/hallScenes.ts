export type HallSceneId = 'archway' | 'corridor' | 'aisle' | 'poruwa' | 'celebration';

export interface HallScene {
  id: HallSceneId;
  src: string;
}

export const hallScenes: HallScene[] = [
{
  id: 'archway',
  src: "/9e871e35-85ad-4585-b2d3-fcc5f4cd0545.jpg"
},
{
  id: 'corridor',
  src: "/f8ac90fd-6b50-407b-81a0-9765ffea191e.jpg"
},
{
  id: 'aisle',
  src: "/8294093e-ea34-43d1-9aca-d7503d4894ab.jpg"
},
{
  id: 'poruwa',
  src: "/8d565dc2-aed5-4764-8c5e-cb7bdf4365b6.jpg"
},
{
  id: 'celebration',
  src: "/587794dd-4cd0-42de-85fc-0cc015830449.jpg"
}];