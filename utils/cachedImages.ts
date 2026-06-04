import cloudinary from "./cloudinary";

let cachedResults: any;

export default async function getResults() {
  if (!cachedResults) {
    const fetchedResults = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("context.order", "asc")
      .max_results(400)
      .with_field('context')
      .execute();

    cachedResults = fetchedResults;
  }

  return cachedResults;
}
