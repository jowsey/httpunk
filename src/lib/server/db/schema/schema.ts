import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const character = sqliteTable("character", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    expLevel: integer("exp_level").notNull().default(1),
    experience: real("experience").notNull().default(0),
    repLevel: integer("rep_level").notNull().default(0),
    repExperience: real("rep_experience").notNull().default(0),
});
