import cloudinary from "./cloudinary";

const cachedResults: Record<string, any> = {};

export default async function getResults(subfolder = "") {
  if (!cachedResults[subfolder]) {
    const folder = subfolder
      ? `${process.env.CLOUDINARY_FOLDER}/${subfolder}`
      : process.env.CLOUDINARY_FOLDER;
    const expression = subfolder ? `folder:${folder}/*` : `folder:${folder}`;
    const fetchedResults = await cloudinary.v2.search
      .expression(expression)
      .sort_by("public_id", "desc")
      .max_results(400)
      .with_field("context")
      .execute();

    cachedResults[subfolder] = fetchedResults;
  }

  return cachedResults[subfolder];
}
