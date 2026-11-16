import { HTTP_STATUS, MESSAGES } from '@/constants';
import { ApiError } from '../errors';
import { mockStore } from '../mock/tagManagementStore';
import type { StoredCategory, StoredTag } from '../mock/tagManagementStore';
import {
  tagCategoriesParamsSchema,
  tagCategoriesResponseSchema,
} from '../type/tag-management/categories-list';
import type {
  TagCategoriesParams,
  TagCategoriesResponse,
} from '../type/tag-management/categories-list';
import { saveCategorySchema } from '../type/tag-management/save-category';
import type { SaveCategoryPayload } from '../type/tag-management/save-category';
import { moveTagSchema, saveTagSchema } from '../type/tag-management/save-tag';
import type { MoveTagPayload, SaveTagPayload } from '../type/tag-management/save-tag';
import type { ManagedCategory, ManagedTag } from '../type/tag-management/shared';
import {
  managedTagsParamsSchema,
  managedTagsResponseSchema,
} from '../type/tag-management/tags-list';
import type { ManagedTagsParams, ManagedTagsResponse } from '../type/tag-management/tags-list';

// Mock implementation: same signatures as the real service will have, backed by `mockStore`.
const MOCK_LATENCY_MS = 300;
const DEFAULT_LIMIT = 20;

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

function toManagedCategory(category: StoredCategory): ManagedCategory {
  const tags = mockStore.tags.filter((tag) => tag.categoryId === category.id);
  return {
    ...category,
    tagCount: tags.length,
    questionCount: tags.reduce((sum, tag) => sum + tag.questionCount, 0),
  };
}

function toManagedTag({ id, name, questionCount }: StoredTag): ManagedTag {
  return { id, name, questionCount };
}

function findCategory(categoryId: number): StoredCategory {
  const category = mockStore.categories.find((candidate) => candidate.id === categoryId);
  if (!category) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.ERROR_UNKNOWN);
  return category;
}

function findTag(tagId: number): StoredTag {
  const tag = mockStore.tags.find((candidate) => candidate.id === tagId);
  if (!tag) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.ERROR_UNKNOWN);
  return tag;
}

function assertTagNameFree(categoryId: number, name: string, ignoreTagId?: number) {
  const taken = mockStore.tags.some(
    (tag) => tag.categoryId === categoryId && tag.id !== ignoreTagId && sameName(tag.name, name),
  );
  if (taken) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.ERROR_UNKNOWN);
}

function assertCategoryNameFree(name: string, ignoreCategoryId?: number) {
  const taken = mockStore.categories.some(
    (category) => category.id !== ignoreCategoryId && sameName(category.name, name),
  );
  if (taken) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.CATEGORY_NAME_TAKEN);
}

function paginate<T>(items: T[], page = 1, limit = DEFAULT_LIMIT) {
  return { page, limit, total: items.length, items: items.slice((page - 1) * limit, page * limit) };
}

export async function getTagCategories(
  params: TagCategoriesParams,
): Promise<TagCategoriesResponse> {
  await wait();
  const { page, limit, search, unused } = tagCategoriesParamsSchema.parse(params);
  const query = search?.trim().toLowerCase() ?? '';
  const matches = mockStore.categories
    .filter((category) => category.name.toLowerCase().includes(query))
    .map(toManagedCategory)
    .filter((category) => !unused || category.questionCount === 0);
  const result = paginate(matches, page, limit);
  return tagCategoriesResponseSchema.parse({ ...result, categories: result.items });
}

export async function getTagCategory(categoryId: number): Promise<ManagedCategory> {
  await wait();
  return toManagedCategory(findCategory(categoryId));
}

export async function createTagCategory(payload: SaveCategoryPayload): Promise<ManagedCategory> {
  await wait();
  const { name, description } = saveCategorySchema.parse(payload);
  assertCategoryNameFree(name);
  const category = { id: mockStore.nextCategoryId++, name, description: description || null };
  mockStore.categories.push(category);
  return toManagedCategory(category);
}

export async function updateTagCategory(
  categoryId: number,
  payload: SaveCategoryPayload,
): Promise<ManagedCategory> {
  await wait();
  const { name, description } = saveCategorySchema.parse(payload);
  const category = findCategory(categoryId);
  assertCategoryNameFree(name, categoryId);
  category.name = name;
  category.description = description || null;
  return toManagedCategory(category);
}

export async function deleteTagCategory(categoryId: number): Promise<void> {
  await wait();
  const category = findCategory(categoryId);
  if (toManagedCategory(category).questionCount > 0) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.ERROR_UNKNOWN);
  }
  mockStore.categories = mockStore.categories.filter((candidate) => candidate.id !== categoryId);
  mockStore.tags = mockStore.tags.filter((tag) => tag.categoryId !== categoryId);
}

export async function getManagedTags(
  categoryId: number,
  params: ManagedTagsParams,
): Promise<ManagedTagsResponse> {
  await wait();
  const { page, limit, search } = managedTagsParamsSchema.parse(params);
  findCategory(categoryId);
  const query = search?.trim().toLowerCase() ?? '';
  const matches = mockStore.tags
    .filter((tag) => tag.categoryId === categoryId && tag.name.toLowerCase().includes(query))
    .map(toManagedTag);
  const result = paginate(matches, page, limit);
  return managedTagsResponseSchema.parse({ ...result, tags: result.items });
}

export async function createManagedTag(
  categoryId: number,
  payload: SaveTagPayload,
): Promise<ManagedTag> {
  await wait();
  const { name } = saveTagSchema.parse(payload);
  findCategory(categoryId);
  assertTagNameFree(categoryId, name);
  const tag = { id: mockStore.nextTagId++, categoryId, name, questionCount: 0 };
  mockStore.tags.push(tag);
  return toManagedTag(tag);
}

export async function renameManagedTag(
  tagId: number,
  payload: SaveTagPayload,
): Promise<ManagedTag> {
  await wait();
  const { name } = saveTagSchema.parse(payload);
  const tag = findTag(tagId);
  assertTagNameFree(tag.categoryId, name, tagId);
  tag.name = name;
  return toManagedTag(tag);
}

export async function moveManagedTag(tagId: number, payload: MoveTagPayload): Promise<ManagedTag> {
  await wait();
  const { categoryId } = moveTagSchema.parse(payload);
  const tag = findTag(tagId);
  findCategory(categoryId);
  assertTagNameFree(categoryId, tag.name, tagId);
  tag.categoryId = categoryId;
  return toManagedTag(tag);
}

export async function deleteManagedTag(tagId: number): Promise<void> {
  await wait();
  if (findTag(tagId).questionCount > 0) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.ERROR_UNKNOWN);
  }
  mockStore.tags = mockStore.tags.filter((tag) => tag.id !== tagId);
}
